import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [searchUser, setSearchUser] = useState("");

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!searchUser) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://api.github.com/users/${searchUser}`
        );

        if (!response.ok) {
          throw new Error("User not found");
        }

        const userData = await response.json();

        setUser(userData);

        const repoResponse = await fetch(userData.repos_url);

        const repoData = await repoResponse.json();

        setRepos(repoData);

        setHistory((prev) => [
          searchUser,
          ...prev.filter((item) => item !== searchUser),
        ]);
      } catch (err) {
        setError(err.message);
        setUser(null);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchUser]);

  const handleSearch = () => {
    if (username.trim() !== "") {
      setSearchUser(username.trim());
    }
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        <div className="header">
          <h1>GitHub Profile Finder</h1>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>

        {history.length > 0 && (
          <div className="history">
            <h3>Recent Searches</h3>

            {history.map((item, index) => (
              <button
                key={index}
                className="history-btn"
                onClick={() => setSearchUser(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {loading && <h2>Loading...</h2>}

        {error && (
          <h3 className="error">
            {error}
          </h3>
        )}

        {user && (
          <div className="profile-card">

            <img
              src={user.avatar_url}
              alt={user.login}
              className="avatar"
            />

            <h2>{user.name || "No Name"}</h2>

            <p>@{user.login}</p>

            <p>
              {user.bio || "No bio available"}
            </p>

            <div className="stats">
              <div>
                <h3>{user.public_repos}</h3>
                <p>Repositories</p>
              </div>

              <div>
                <h3>{user.followers}</h3>
                <p>Followers</p>
              </div>

              <div>
                <h3>{user.following}</h3>
                <p>Following</p>
              </div>
            </div>

            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="github-btn"
            >
              Visit GitHub Profile
            </a>
          </div>
        )}

        {repos.length > 0 && (
          <div className="repo-section">
            <h2>Repositories</h2>

            {repos.map((repo) => (
              <div
                className="repo-card"
                key={repo.id}
              >
                <h3>{repo.name}</h3>

                <p>
                  {repo.description ||
                    "No description"}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;