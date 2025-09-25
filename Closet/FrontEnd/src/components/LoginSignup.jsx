import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSignup = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let result;
            if (state === "login") {
                result = await login(email, password);
            } else {
                result = await register(name, email, password);
            }

            if (result.success) {
                // Success message
                alert(`${state === "login" ? "Login" : "Registration"} successful!`);
                
                // Navigate to home page
                navigate("/");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Auth error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-nav overflow-hidden">
            {/* Blurred Background Image */}
            <div 
                className="absolute inset-0 bg-cover w-full h-auto bg-center bg-no-repeat blur-md scale-110" 
                style={{backgroundImage: 'url("/MainBanner.png")'}}
            ></div>
            
            {/* Optional dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Login Form */}
            <div className="relative z-10">           
                <form onSubmit={handleSubmit} className="flex items-center flex-col gap-4 m-auto p-8 py-12 w-80 sm:w-[352px] text-nav rounded-lg shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm">
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-nav">User</span> {state === "login" ? "Login" : "Sign Up"}
                    </p>
                    
                    {error && (
                        <div className="w-full p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    
                    {state === "register" && (
                        <div className="w-full">
                            <p>Name</p>
                            <input 
                                onChange={(e) => setName(e.target.value)} 
                                value={name} 
                                placeholder="Enter your name" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" 
                                type="text" 
                                required 
                                disabled={loading}
                            />
                        </div>
                    )}
                    
                    <div className="w-full">
                        <p>Email</p>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            placeholder="Enter your email" 
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" 
                            type="email" 
                            required 
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="w-full">
                        <p>Password</p>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            placeholder="Enter your password" 
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" 
                            type="password" 
                            required 
                            minLength="6"
                            disabled={loading}
                        />
                    </div>
                    
                    {state === "register" ? (
                        <p>
                            Already have account? 
                            <span 
                                onClick={() => !loading && setState("login")} 
                                className={`text-DarkBlue hover:text-indigo-400 cursor-pointer ${loading ? 'opacity-50' : ''}`}
                            >
                                {" "}click here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Create an account? 
                            <span 
                                onClick={() => !loading && setState("register")} 
                                className={`text-DarkBlue hover:text-indigo-400 transition-all duration-300 cursor-pointer ${loading ? 'opacity-50' : ''}`}
                            >
                                {" "}click here
                            </span>
                        </p>
                    )}

                    {/* Guest login */}
                    <div>
                        <button 
                            onClick={() => navigate("/")} 
                            type="button"
                            className='hover:text-indigo-400 transition-all duration-300 cursor-pointer'
                        >
                            <p>Continue as guest</p>
                        </button>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-nav hover:bg-indigo-400 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {state === "register" ? "Creating..." : "Logging in..."}
                            </div>
                        ) : (
                            state === "register" ? "Create Account" : "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginSignup