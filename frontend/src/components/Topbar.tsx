import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaUserCircle } from 'react-icons/fa';

export const Topbar = () => {
    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="text-orange-500 font-bold text-2xl">
                                LC
                            </div>
                            <span className="ml-2 text-white font-semibold text-lg">
                                LeetClone
                            </span>
                        </Link>
                        <NavBar />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <a 
                            href="https://github.com/yourusername/leetcode-clone" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white"
                        >
                            <FaGithub size={20} />
                        </a>
                        <div className="w-px h-6 bg-gray-600"></div>
                        <div className="flex items-center text-gray-300 hover:text-white cursor-pointer">
                            <FaUserCircle size={24} />
                            <span className="ml-2 text-sm">Profile</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const topbarItems = [
    {
        title: "Problems",
        route: "/problems"
    },
    
];

function NavBar() {
    const location = useLocation();
    
    return (
        <div className="hidden md:flex items-center ml-8 space-x-1">
            {topbarItems.map((item, index) => (
                <NavbarItem 
                    key={index} 
                    route={item.route} 
                    title={item.title} 
                    isActive={location.pathname === item.route}
                />
            ))}
        </div>
    );
}

function NavbarItem({ title, route, isActive }: { title: string; route: string; isActive?: boolean }) {
    return (
        <Link to={route}>
            <div 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } transition-colors duration-200`}
            >
                {title}
            </div>
        </Link>
    );
}