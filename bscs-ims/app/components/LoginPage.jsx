import { StripedPattern } from "../modules/magicui/StrippesBg";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-16 relative overflow-hidden">
      <StripedPattern 
        direction="right" 
        className="text-slate-500/80 opacity-40"
        width={20}
        height={20}
      />
      
      <div className="mb-16 relative z-10">
        <h1 className="text-4xl font-bold text-indigo-500">
          Murang Bigas<br />Livelihood
        </h1>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-500 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-500 text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label 
              className="block mb-2 text-sm font-medium text-indigo-500" 
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              type="email"
              id="email"
              placeholder="Email"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your email address
            </p>
          </div>

          <div>
            <label 
              className="block mb-2 text-sm font-medium text-indigo-500" 
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              type="password"
              id="password"
              placeholder="Password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your password
            </p>
          </div>

          <button className="w-full bg-indigo-500 text-white py-3 px-4 rounded hover:bg-indigo-700 transition duration-200 font-medium mt-8">
            Submit
          </button>
        </div>
      </div>

      <p className="absolute bottom-8 right-16 text-indigo-500 text-sm z-10">
        BSCS © 2027
      </p>
    </div>
  );
}