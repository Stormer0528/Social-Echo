import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";
import JoinModal from "../modals/JoinModal";
import { MoonLoader } from "react-spinners";
import { BsSearch } from "react-icons/bs";
import { MdClear } from "react-icons/md";

const BASE_URL = process.env.REACT_APP_API_URL;

const Search = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [community, setCommunity] = useState(null);
  const [joinedCommunity, setJoinedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  const setInitialValue = () => {
    setUsers([]);
    setPosts([]);
    setCommunity(null);
    setJoinedCommunity(null);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((q) => {
        setLoading(true);
        const encodedQuery = encodeURIComponent(q);
        axios
          .get(`${BASE_URL}/search?q=${encodedQuery}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            const { posts, users, community, joinedCommunity } = res.data;
            setPosts(posts);
            setUsers(users);
            setCommunity(community);
            setJoinedCommunity(joinedCommunity);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }, 800),
    [accessToken]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setInitialValue();
      return;
    }

    debouncedHandleSearch(value);
  };

  const clearValues = () => {
    setInitialValue();
    setInputValue("");
  };
  useEffect(() => {
    return () => {
      setInitialValue();
    };
  }, []);

  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const toggleModal = () => {
    setJoinModalVisibility((prev) => !prev);
  };

  return (
    <div>
      <input
        type="text"
        id="search"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Try searching for people, communities, and posts."
        className="h-10 py-1 bg-white border w-[660px] rounded-full text-sm shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-500 transition duration-300 pl-3"
        aria-label="Search"
        autoComplete="off"
      />

      {inputValue !== "" && (
        <div
          onBlur={() => !community && clearValues()}
          className="absolute w-[660px] z-30 rounded-md mt-1 border bg-white"
        >
          {loading && (
            <div className="flex items-center justify-center py-2 px-2">
              <MoonLoader size={20} color={"#008cff"} />
              <span className="ml-2">Searching...</span>
            </div>
          )}
          {posts.length > 0 && (
            <ul>
              {posts.map((post) => (
                <li key={post._id} className="border-b py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/post/${post._id}`);
                      clearValues();
                    }}
                    className="block text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="h-8 w-8 rounded-full"
                          loading={"lazy"}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.content}
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted by {post.user.name} in {post.community.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {users.length > 0 && (
            <ul>
              {users.map((user) => (
                <li key={user._id} className="border-b py-2 px-4">
                  <div
                    onClick={() => {
                      navigate(`/user/${user._id}`);
                      clearValues();
                    }}
                    className="block text-sm text-gray-700 hover:text-indigo-500 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {community && (
            <div className="border-b py-2 px-4">
              {!community.isMember && (
                <>
                  <JoinModal
                    show={joinModalVisibility}
                    onClose={() => {
                      toggleModal(false);
                      setCommunity(null);
                    }}
                    community={community}
                  />
                  <button onClick={() => toggleModal(true)}>Join</button>
                </>
              )}

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={community.banner}
                    alt={community.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{community.name}</p>
                  <p className="text-sm">{community.description}</p>
                </div>
              </div>
            </div>
          )}

          {joinedCommunity && (
            <div
              key={joinedCommunity._id}
              onClick={() => {
                navigate(`/community/${joinedCommunity.name}`);
                clearValues();
              }}
              className="block text-sm text-gray-700 hover:text-indigo-500 border-b py-2 px-4 cursor-pointer"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={joinedCommunity.banner}
                    alt={joinedCommunity.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{joinedCommunity.name}</p>
                  <p className="text-sm text-gray-600">
                    {joinedCommunity.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
