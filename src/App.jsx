import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [passwords, setPasswords] = useState(() => {
    const savedPasswords = JSON.parse(localStorage.getItem("passwords"));
    return savedPasswords || [];
  });

  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [strength, setStrength] = useState("Strength: N/A");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");

  // Apply dark mode class to the body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("passwords", JSON.stringify(passwords));
  }, [passwords]);

  const handlePasswordStrength = () => {
    let strengthValue = "Weak";
    if (password.length > 6 && /[A-Z]/.test(password) && /\d/.test(password))
      strengthValue = "Medium";
    if (
      password.length > 10 &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    )
      strengthValue = "Strong";
    setStrength("Strength: " + strengthValue);
  };

  const addPassword = () => {
    if (!website || !username || !password) {
      setMessage("⚠️ Please fill in all fields.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    const newEntry = { website, username, password , visible: false};
    setPasswords([...passwords, newEntry]);
    setWebsite("");
    setUsername("");
    setPassword("");
    setStrength("Strength: N/A");
    setMessage("✅ Password saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deletePassword = (index) => {
    const newPasswords = passwords.filter((_, i) => i !== index);
    setPasswords(newPasswords);
  };

  const togglePasswordVisibility = (selectedEntry) => {
    const updatedPasswords = passwords.map((entry) =>
      entry === selectedEntry
        ? { ...entry, visible: !entry.visible }
        : entry
    );
    setPasswords(updatedPasswords);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`App`}>
      <div className="theme-toggle">
        <label>
          <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
          <span>🌙 Dark Mode</span>
        </label>
      </div>

      <div className="container">
        <h1>Password Manager 🔐</h1>

        <div className="password-form">
          <input
            type="text"
            placeholder="Enter Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autocomplete="off" 
          />
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autocomplete="off" 
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handlePasswordStrength();
              autocomplete="off" 
            }}
          />
          <div className="strength">{strength}</div>
          <button onClick={addPassword}>➕ Add Password</button>
        </div>

        {message && <div className="warning-message">{message}</div>}

        <div className="password-controls">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="password-list">
          <ul>
            {passwords
              .filter(
                (entry) =>
                  entry.website.toLowerCase().includes(search.toLowerCase()) ||
                  entry.username.toLowerCase().includes(search.toLowerCase())
              )
              .map((entry, index) => (
                <li key={index}>
                  <strong>{entry.website}</strong><br />
                  {entry.username} -{" "}
                  <span className="password">
                    {entry.visible ? entry.password : "*".repeat(entry.password.length)}
                  </span>
                  <div className="actions">
                    <button className="copy-btn">Copy</button>
                    <button
  className="show-btn"
  onClick={() => togglePasswordVisibility(entry)}
>
  Show
</button>
                    <button className="delete-btn" onClick={() => deletePassword(index)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
