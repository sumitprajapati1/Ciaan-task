'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { getAuthToken } from '../utils/auth';

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Extract user ID from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.userId);
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await api.post('/posts', { content: newPost });
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    const comment = commentText[postId];
    if (!comment?.trim()) return;

    try {
      const response = await api.post('/comments', {
        content: comment,
        postId
      });
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [response.data, ...post.comments] }
          : post
      ));
      setCommentText({ ...commentText, [postId]: '' });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: post.comments.filter(c => c._id !== commentId) }
          : post
      ));
    } catch (error) {
      console.error('Error deleting comment:', error);
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

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Create Post */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!newPost.trim()}
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{post.author?.name || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {post.author._id === currentUserId && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-800 mb-4">{post.content}</p>
              
              {/* Like Button */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center space-x-1 text-sm ${
                    post.likes.includes(currentUserId) ? 'text-blue-500' : 'text-gray-500'
                  } hover:text-blue-500`}
                >
                  <span>❤️</span>
                  <span>{post.likes.length} likes</span>
                </button>
                <button
                  onClick={() => setShowComments({ ...showComments, [post._id]: !showComments[post._id] })}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500"
                >
                  <span>💬</span>
                  <span>{post.comments.length} comments</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments[post._id] && (
                <div className="border-t pt-4">
                  {/* Add Comment */}
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                      placeholder="Write a comment..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Comment
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex items-start space-x-2">
                        
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                            {comment.author?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm font-semibold">{comment.author?.name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-800">{comment.content}</p>
                          </div>
                          {comment.author._id === currentUserId && (
                            <button
                              onClick={() => handleDeleteComment(post._id, comment._id)}
                              className="text-red-500 hover:text-red-700 text-xs mt-1"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}