
import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { UserContext } from '../../../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../../../utilit/helper';
import axiosInstance from '../../../../utilit/axiosInstance';
import { API_PATHS } from '../../../../utilit/apiPath';
import Input from '../../../../compontes/inputs/Input';
import ProfilePhotoSelector from '../../../../compontes/inputs/ProfilePhotoSelector';
import uploadImage from '../../../../utilit/uploads';

export default function Signup() {
    const [profilepPic, setprofilePic] = useState<File | null>(null);
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminInviteToken, setAdminInviteToken] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let profileImageUrl = '';

        if (!fullName.trim()) {
            setError('Enter full name');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setError('Enter password');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Upload profile image if selected
            if (profilepPic) {
                const imgUploadRes = await uploadImage(profilepPic);
                profileImageUrl = imgUploadRes.imageUrl || '';
            }

            const response = await axiosInstance.post(
                API_PATHS.AUTH.REGISTER,
                {
                    name: fullName.trim(),
                    email,
                    password,
                    profileImageUrl,
                    adminInviteToken,
                    referralCode,
                }
            );

            const user = response.data;

            updateUser(user);

            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message
                : undefined;

            setError(
                message || 'Something went wrong. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full md:h-full flex flex-col justify-center items-center bg-black gap-4">
            <h3 className="text-xl font-semibold text-yellow-300">
                create an account
            </h3>

            <form
                onSubmit={handleSignup}
                className="bg-gray-800/50 rounded-2xl w-80 p-5 flex flex-col gap-3"
            >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <ProfilePhotoSelector
                        image={profilepPic}
                        setImage={setprofilePic}
                    />

                    <Input
                        value={fullName}
                        onChange={({ target }) => setfullName(target.value)}
                        lable="Full Name"
                        placeholder="john"
                        type="text"
                    />

                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        lable="email address"
                        placeholder="examople@email.com"
                    />

                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        lable="enter password"
                        placeholder="Min 8 characters"
                    />

                    <Input
                        type="text"
                        placeholder="Referral code (optional)"
                        value={referralCode}
                        onChange={({ target }) =>
                            setReferralCode(target.value.toUpperCase())
                        }
                    />

                    <Input
                        type="text"
                        value={adminInviteToken}
                        onChange={(e) =>
                            setAdminInviteToken(e.target.value)
                        }
                        lable="Admin Invite Token"
                        placeholder="6 digit code"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-xs pb-2.5">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                >
                    {loading ? 'PLEASE WAIT...' : 'SIGN UP'}
                </button>

                <p className="text-blue-200 text-[13px] mt-3">
                    Already have an account?{' '}
                    <Link
                        className="font-medium text-primary underline"
                        to="/login"
                    >
                        LOGIN
                    </Link>
                </p>
            </form>
        </div>
    );
}
