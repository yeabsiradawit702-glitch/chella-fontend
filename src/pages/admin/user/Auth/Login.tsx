
import { useContext, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import type { User } from '../../../../context/UserContext';
import { UserContext } from '../../../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../../../utilit/helper';
import axiosInstance from '../../../../utilit/axiosInstance';
import { API_PATHS } from '../../../../utilit/apiPath';
import Input from '../../../../compontes/inputs/Input';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [challengeToken, setChallengeToken] = useState('');
    const [requiresOtp, setRequiresOtp] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [resending, setResending] = useState(false);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!requiresOtp || resendCooldown <= 0) return;

        const timer = setTimeout(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [requiresOtp, resendCooldown]);

    const goToDashboard = (user: User) => {
        updateUser(user);

        if (user.role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/user/dashboard');
        }
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setError('Enter password');
            return;
        }

        setError('');
        setNotice('');
        setLoading(true);

        try {
            const response = await axiosInstance.post(
                API_PATHS.AUTH.LOGIN,
                { email, password }
            );

            const user = response.data;

            if (user.requiresOtp) {
                setChallengeToken(user.challengeToken);
                setRequiresOtp(true);
                setResendCooldown(60);
                setOtp('');
                setError('');
                setNotice(
                    user.message || 'Verification code sent to your email.'
                );
                return;
            }

            goToDashboard(user);
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;

            setError(
                message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!/^\d{6}$/.test(otp)) {
            setError('Enter the six-digit verification code');
            return;
        }

        setError('');
        setNotice('');
        setLoading(true);

        try {
            const response = await axiosInstance.post(
                API_PATHS.AUTH.VERIFY_LOGIN_OTP,
                {
                    challengeToken,
                    otp,
                }
            );

            goToDashboard(response.data);
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;

            setError(
                message || 'OTP verification failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resending || resendCooldown > 0) return;

        setError('');
        setNotice('');
        setResending(true);

        try {
            const response = await axiosInstance.post(
                API_PATHS.AUTH.RESEND_LOGIN_OTP,
                { challengeToken }
            );

            setOtp('');
            setResendCooldown(60);
            setNotice(
                response.data.message ||
                'A new verification code has been sent.'
            );
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;

            setError(message || 'Failed to resend verification code');
        } finally {
            setResending(false);
        }
    };

    const handleBackToLogin = () => {
        setRequiresOtp(false);
        setOtp('');
        setChallengeToken('');
        setError('');
        setNotice('');
        setResendCooldown(60);
    };

    return (
        <div className="min-h-screen w-full md:h-full flex flex-col justify-center items-center bg-black gap-4">
            <h2 className="text-yellow-300 text-2xl">Chella</h2>

            <h3 className="text-xl font-semibold text-white">
                {requiresOtp
                    ? 'Email Verification'
                    : 'Welcome back to your reward'}
            </h3>

            <form
                onSubmit={requiresOtp ? handleVerifyOtp : handleLogin}
                className="bg-gray-800/50 rounded-2xl w-80 p-5 flex flex-col gap-3"
            >
                {!requiresOtp ? (
                    <>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            lable="Email address"
                            placeholder="example@email.com"
                        />

                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            lable="Enter password"
                            placeholder="Minimum 8 characters"
                        />
                    </>
                ) : (
                    <>
                        <p className="text-gray-300 text-sm text-center">
                            A six-digit verification code was sent to your email.
                        </p>

                        <Input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(/\D/g, '').slice(0, 6)
                                )
                            }
                            lable="Verification code"
                            placeholder="Enter 6-digit OTP"
                        />
                    </>
                )}

                {error && (
                    <p className="text-red-500 text-xs text-center">
                        {error}
                    </p>
                )}

                {notice && (
                    <p className="text-green-400 text-xs text-center">
                        {notice}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading || (requiresOtp && otp.length !== 6)}
                    className="btn-primary disabled:opacity-50"
                >
                    {loading
                        ? 'PLEASE WAIT...'
                        : requiresOtp
                            ? 'VERIFY OTP'
                            : 'LOGIN'}
                </button>

                {requiresOtp && (
                    <>
                        <div className="text-center mt-2">
                            {resendCooldown > 0 ? (
                                <p className="text-gray-300 text-sm">
                                    Resend code in{' '}
                                    <span className="text-yellow-300 font-semibold">
                                        {resendCooldown}s
                                    </span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="text-yellow-300 text-sm font-semibold disabled:opacity-50"
                                >
                                    {resending ? 'SENDING...' : 'RESEND OTP'}
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="text-gray-300 text-sm mt-2"
                        >
                            Back to login
                        </button>
                    </>
                )}

                {!requiresOtp && (
                    <p className="text-blue-200 text-[13px] mt-3 flex justify-center items-center">
                        Don't have an account?
                        <Link
                            className="font-medium text-primary underline ml-1"
                            to="/signup"
                        >
                            SIGNUP
                        </Link>
                    </p>
                )}
            </form>
        </div>
    );
}
