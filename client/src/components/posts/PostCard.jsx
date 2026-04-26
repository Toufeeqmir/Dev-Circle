import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useSelector } from "react-redux";

const PostCard = ({ post, onVote, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isOwner =
    user && String(user._id) === String(post.author?._id || post.author);

  const handleVote = async (event, type) => {
    event.stopPropagation();
    try {
      const response = await api.put(`/posts/${post._id}/vote`, { type });
      onVote?.(post._id, response.data.voteScore);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete?.(post._id);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 404) {
        onDelete?.(post._id);
      }
    }
  };

  const handleShare = async (event) => {
    event.stopPropagation();
    const shareUrl = `${window.location.origin}/post/${post._id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: shareUrl
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      window.alert("Post link copied");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article
      onClick={() => navigate(`/post/${post._id}`)}
      className="bg-white border border-gray-300 rounded hover:border-gray-500 cursor-pointer flex"
    >
      <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l">
        <button
          type="button"
          onClick={(event) => handleVote(event, "up")}
          className="text-gray-400 hover:text-orange-500 font-bold"
        >
          up
        </button>
        <span className="text-xs font-bold text-gray-700">{post.voteScore}</span>
        <button
          type="button"
          onClick={(event) => handleVote(event, "down")}
          className="text-gray-400 hover:text-blue-500 font-bold"
        >
          down
        </button>
      </div>

      <div className="p-3 flex-1">
        <div className="text-xs text-gray-500 mb-1 flex flex-wrap gap-1">
          {post.community && (
            <>
              <Link
                to={`/c/${post.community.name}`}
                onClick={(event) => event.stopPropagation()}
                className="font-bold text-black no-underline hover:underline"
              >
                r/{post.community.name}
              </Link>
              <span>-</span>
            </>
          )}
          <span>Posted by</span>
          <Link
            to={`/u/${post.author?.username}`}
            onClick={(event) => event.stopPropagation()}
            className="font-semibold text-gray-700 no-underline hover:underline"
          >
            u/{post.author?.username}
          </Link>
        </div>

        <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>

        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="w-full h-48 object-cover mt-2 rounded"
          />
        )}

        <p className="text-sm text-gray-700 mt-1">{post.content}</p>

        <div className="flex gap-4 mt-2 text-xs text-gray-500 items-center flex-wrap">
          <span>{post.commentCount} Comments</span>
          <button type="button" onClick={handleShare} className="hover:underline">
            Share
          </button>
          {isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
