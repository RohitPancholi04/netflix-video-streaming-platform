import React, { useState } from 'react';
import Header from './Header';
import axios from 'axios';
import { API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../redux/userSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoading = useSelector((store) => store.app.isLoading);

    const toggleAuthMode = () => setIsLogin((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        const userData = isLogin ? { email, password } : { fullName, email, password };

        try {
            const endpoint = isLogin ? '/login' : '/register';
            const { data } = await axios.post(`${API_END_POINT}${endpoint}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (data?.success) {
                toast.success(data.message || '');
                if (isLogin) {
                    dispatch(setUser(data.user || null));
                    navigate('/browse');
                } else {
                    setIsLogin(true);
                }
            }
        } catch (error) {
            console.error('Auth Error:', error);
            const msg = error?.response?.data?.message || 'Something went wrong';
            toast.error(msg);
        } finally {
            dispatch(setLoading(false));
            setFullName('');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div>
            <Header />
            <div className="absolute">
                <img
                    className="w-[100vw] h-[100vh] bg-cover"
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/dc1cf82d-97c9-409f-b7c8-6ac1718946d6/14a8fe85-b6f4-4c06-8eaf-eccf3276d557/IN-en-20230911-popsignuptwoweeks-perspective_alpha_website_medium.jpg"
                    alt="banner"
                />
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-3/12 p-12 my-36 mx-auto absolute left-0 right-0 items-center justify-center rounded-md bg-black opacity-90"
            >
                <h1 className="text-3xl text-white mb-5 font-bold">
                    {isLogin ? 'Login' : 'Signup'}
                </h1>
                <div className="flex flex-col w-full">
                    {!isLogin && (
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            placeholder="Full Name"
                            className="outline-none p-3 my-2 rounded-sm bg-gray-800 text-white"
                            required
                        />
                    )}
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        className="outline-none p-3 my-2 rounded-sm bg-gray-800 text-white"
                        required
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className="outline-none p-3 my-2 rounded-sm bg-gray-800 text-white"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-red-600 mt-6 p-3 text-white rounded-sm font-medium"
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Signup'}
                    </button>
                    <p className="text-white mt-2 text-sm text-center">
                        {isLogin ? 'New to Netflix?' : 'Already have an account?'}
                        <span
                            onClick={toggleAuthMode}
                            className="ml-1 text-blue-500 font-medium cursor-pointer"
                        >
                            {isLogin ? 'Signup' : 'Login'}
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
