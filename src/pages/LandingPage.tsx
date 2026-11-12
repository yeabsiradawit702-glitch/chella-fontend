
import { MoveRight, UsersRound, Database, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black m-0 p-0">

      <nav className="flex justify-between items-center p-6">
        <div className="flex gap-1 justify-between items-start">
          <h1 className="text-yellow-300 font-bold text-xl sm:text-[16px]">chella</h1>
          <p className="text-gray-400 max-sm:hidden">Reward app</p>
        </div>

        <div className="flex gap-2 items-center max-sm:hidden
        ">
          <Link to="/login">
            <button className="border border-amber-300 text-yellow-300 w-20 rounded-sm py-1 hover:bg-amber-300 hover:text-black transition">
              login
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-amber-300 text-black w-30 rounded-sm py-1 hover:bg-yellow-400 transition">
              Getstarted
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex justify-center items-center flex-col gap-10 px-4">

        <div className="grid gap-3 text-center">
          <h1 className="text-white text-4xl md:text-6xl  font-bold">
            Turn Every Action Into
          </h1>

          <h1 className="text-yellow-300 text-4xl md:text-6xl font-bold">
            Reward
          </h1>

          <p className="text-gray-400">
            Earn bonuses, complete tasks, and grow your network with Chella. The exclusive financial membership for
            the rewards generation.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/signup">
            <button className="bg-amber-300 text-black rounded-sm flex items-center gap-2 p-2 font-bold hover:bg-yellow-400 transition">
              Getstarted <MoveRight size={18} />
            </button>
          </Link>

          <Link to="/login">
            <button className="text-yellow-300 rounded-sm border border-amber-300 p-2 hover:bg-amber-300 hover:text-black transition">
              Login to Account
            </button>
          </Link>
        </div>

        <div>
          <h1 className="text-white text-3xl font-bold text-center">
            Why Choose Chella?
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-6 p-4 md:p-10 rounded-sm w-full max-w-6xl">

          <div className="bg-[#171717] border border-gray-800 min-h-50 p-5 rounded-sm hover:border-amber-300 transition">
            <div>
              <Database className="bg-gray-700 text-yellow-300 rounded-sm p-2 size-10" />
            </div>

            <div className="flex justify-center flex-col items-center gap-2 text-center">
              <h1 className="text-white font-bold text-2xl">
                100 ETB Signup Bonus
              </h1>

              <p className="text-gray-400">
                Get credited instantly when you register and
                start earning immediately,
              </p>
            </div>
          </div>

          <div className="bg-[#171717] border border-gray-800 min-h-50 p-5 rounded-sm hover:border-amber-300 transition">
            <div>
              <UsersRound className="bg-gray-700 text-yellow-300 rounded-sm p-2 size-10" />
            </div>

            <div className="flex justify-center flex-col items-center gap-2 text-center">
              <h1 className="text-white font-bold text-2xl">
                20 ETB per Referral
              </h1>

              <p className="text-gray-400">
                Share your code and earn rewards for every
                friend who joins Chella.
              </p>
            </div>
          </div>

          <div className="bg-[#171717] border border-gray-800 min-h-50 p-5 rounded-sm hover:border-amber-300 transition">
            <div>
              <Zap className="bg-gray-700 text-yellow-300 rounded-sm p-2 size-10" />
            </div>

            <div className="flex justify-center flex-col items-center gap-2 text-center">
              <h1 className="text-white font-bold text-2xl">
                Daily Reward Tasks
              </h1>

              <p className="text-gray-400">
                Complete simple tasks daily and watch your
                balance grow effortlessly.
              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center gap-4 w-full max-w-5xl">

          <div className="flex justify-center items-center bg-[#171717] border border-gray-800 rounded-sm p-8 w-55">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-yellow-300 font-bold text-2xl">50K+</h1>
              <p className="text-gray-400">Active users</p>
            </div>
          </div>

          <div className="flex justify-center items-center bg-[#171717] border border-gray-800 rounded-sm p-8 w-55">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-yellow-300 font-bold text-2xl">500K+</h1>
              <p className="text-gray-400">EtB distrbuited</p>
            </div>
          </div>

          <div className="flex justify-center items-center bg-[#171717] border border-gray-800 rounded-sm p-8 w-55">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-white font-bold text-2xl">3</h1>
              <p className="text-gray-400">currency supported</p>
            </div>
          </div>

          <div className="flex justify-center items-center bg-[#171717] border border-gray-800 rounded-sm p-8 w-55">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-yellow-300 font-bold text-2xl">99%</h1>
              <p className="text-gray-400">User satisification</p>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-2 justify-center items-center text-center py-6" >
          <h1 className="text-white text-2xl font-bold">
            Ready to Start Earning?
          </h1>

          <p className="text-gray-400">
            Join thousands of users already rewarded by Chella.
          </p>

          <Link to="/signup">
            <button className="bg-amber-300 text-black rounded-sm p-2 hover:bg-yellow-400 transition">
              Create Your account now
            </button>
          </Link>
        </div>

        <footer className="w-full border-t border-gray-800 py-5 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Chella. All rights reserved.
          </p>
        </footer>

      </main>
    </div>
  );
}