import { getSavedPostsAction } from "../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SavedPost from "../components/post/SavedPost";

const Saved = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSavedPostsAction());
  }, [dispatch]);

  const savedPosts = useSelector((state) => state.posts?.savedPosts);

  return (
    <div className="main-section">
      <div className="flex flex-col mb-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center border-b py-3">
          Your saved posts
        </h2>

        {savedPosts && savedPosts.length > 0 ? (
          <div className="flex flex-col items-center">
            {savedPosts.reverse().map((post) => (
              <SavedPost key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 font-medium mt-6">
            You have not saved any posts yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
