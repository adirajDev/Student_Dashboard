import { PenSquare, UserCog, Newspaper } from 'lucide-react';
import NavItem from '../NavItem';

const BloggerLinks = ({ activeTab, handleNav }) => {
    return (
        <>
            <NavItem
                icon={<PenSquare className="w-5 h-5" />}
                label="Write a Post"
                isActive={activeTab === 'write'}
                onClick={() => handleNav('/blogger/dashboard?tab=write')}
            />
            <NavItem
                icon={<UserCog className="w-5 h-5" />}
                label="Update Profile"
                isActive={activeTab === 'profile'}
                onClick={() => handleNav('/blogger/dashboard?tab=profile')}
            />
            <NavItem
                icon={<Newspaper className="w-5 h-5" />}
                label="View Your Posts"
                isActive={activeTab === 'posts'}
                onClick={() => handleNav('/blogger/dashboard?tab=posts')}
            />
        </>
    );
};

export default BloggerLinks;
