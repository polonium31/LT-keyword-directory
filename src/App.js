import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faLink } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/logo.png";
function App() {
  const [searchData, setSearchData] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [articlesFound, setArticlesFound] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showList, setShowList] = useState(false);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://script.google.com/macros/s/AKfycbxRZf6v42rbvQKsdztMMxQKnG8CREozrDhKfomR88GuRyXqxsm4uEwGZXVSmK_Tkg_G/exec"
        );
        const rawData = response.data.data;
        const filteredData = rawData.filter(
          (row) => row["Keywords"] && row["URLs to Interlink"]
        );

        setSearchData(filteredData);
        setKeywordData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filteredArticles = searchData.filter((item) =>
      item["Keywords"]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setArticlesFound(filteredArticles.length > 0);
  }, [searchData, searchQuery]);

  const sortedBlogs = [...keywordData].sort((a, b) =>
    a["Keywords"]?.toLowerCase() > b["Keywords"]?.toLowerCase() ? 1 : -1
  );

  const toggleList = () => {
    setShowList(!showList);
    setSearchQuery("");
    var getValue = document.getElementById("basic-url");
    if (getValue.value !== "") {
      getValue.value = "";
    }
  };

  // Function to handle the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(sortedBlogs.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to copy the link to the clipboard and show a toast message
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text); // Copy the text to the clipboard
    toast.success("Link copied to clipboard", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a href="/" className="navbar-brand">
            <img src={logo} width="200" alt="Logo" />
          </a>
          <div className="navbar-text">
            <h3 style={{ marginRight: "10px", color: "#000000" }}>
              Keyword Directory
            </h3>
          </div>
        </div>
      </nav>
      <div className="container p-4">
        <div className="row justify-content-center">
          <div className="col-10">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon3">
                Search
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                name="search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowList(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container p-2">
        {searchQuery.trim() === "" ? (
          <div className="text-center mt-4">
            <h2>Welcome to the Articles Directory!</h2>
            <p>Enter your search query above to find articles.</p>
          </div>
        ) : articlesFound ? (
          <table className="table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Article Link</th>
                <th>Copy Link</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div className="text-center mt-4">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading data...</p>
                </div>
              ) : (
                searchData
                  .filter((item) =>
                    item["Keywords"]
                      ?.toLowerCase()
                      .includes(searchQuery?.toLowerCase())
                  )
                  .map((item, index) => (
                    <tr className="table-row" key={index}>
                      <td style={{ width: "60%" }}>
                        {item["Keywords"]
                          ?.toLowerCase()
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </td>
                      <td className="other">
                        <a
                          href={item["URLs to Interlink"]}
                          target="_blank"
                          rel="noreferrer"
                          className="link"
                        >
                          <FontAwesomeIcon icon={faLink} /> Link
                        </a>
                      </td>
                      <td className="other">
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            copyToClipboard(item["URLs to Interlink"])
                          }
                        >
                          <FontAwesomeIcon icon={faCopy} id="icon" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-4">
            <h4>No articles found for the search query.</h4>
          </div>
        )}
      </div>
      {/* Key Glossary button */}
      <div className="text-center mt-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={toggleList}
          style={{ fontWeight: "bold", marginBottom: "2%" }}
        >
          {showList ? "Hide List" : "Keyword Glossary"}
        </button>
      </div>
      {/* Conditionally render the list of blogs */}
      {showList && (
        <div className="container p-2">
          {isLoading ? (
            <div className="text-center mt-4">
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading data...</p>
            </div>
          ) : (
            // Render your section content
            <table className="table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Article Link</th>
                  <th>Copy Link</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((item, index) => (
                  <tr className="table-row" key={index}>
                    <td style={{ width: "60%" }}>
                      {item["Keywords"]
                        ?.toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </td>
                    <td className="other">
                      <a
                        href={item["URLs to Interlink"]}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        <FontAwesomeIcon icon={faLink} /> Link
                      </a>
                    </td>
                    <td className="other">
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          copyToClipboard(item["URLs to Interlink"])
                        }
                      >
                        <FontAwesomeIcon icon={faCopy} id="icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button className="page-link" onClick={prevPage}>
                  &laquo; Prev
                </button>
              </li>
              {Array(Math.ceil(sortedBlogs.length / itemsPerPage))
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              <li
                className={`page-item ${
                  currentPage === Math.ceil(sortedBlogs.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
              >
                <button className="page-link" onClick={nextPage}>
                  Next &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
