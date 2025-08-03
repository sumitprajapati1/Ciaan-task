'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import api from '../../../utils/api';
import { getAuthToken } from '../../../utils/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export default function ProfilePage({ params }: { params: Promise<{ userid: string }> }) {
  return <ProfilePageClient params={params} />;
}

function ProfilePageClient({ params }: { params: Promise<{ userid: string }> }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userid, setUserid] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserid(resolvedParams.userid);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!userid) return;
    
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserAndPosts = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          api.get(`/users/${userid}`),
          api.get(`/posts/user/${userid}`)
        ]);
        
        setUser(userResponse.data);
        setPosts(postsResponse.data);
        
        // Check if this is the current user's profile
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        setIsCurrentUser(currentUser._id === userid);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [userid, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      
      setUser(prev => prev ? { ...prev } : null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              {user.bio && <p className="text-gray-700">{user.bio}</p>}
            </div>

            {isCurrentUser && (
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                <button
                  onClick={handlePhotoUpload}
                  disabled={!selectedFile || uploading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800">{post.content}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <span>❤️ {post.likes.length} likes</span>
                  <span>💬 {post.comments.length} comments</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}