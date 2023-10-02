import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

// Create a context object for GitHub.
const GithubContext = createContext();

// Define the GitHub URL and token.
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// Create a provider component for the GitHub context.
export const GithubProvider = ({ children }) => {
    // Create state variables for the users and loading state.
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false,
    };

    const [state, dispatch] = useReducer(githubReducer, initialState);

    // Get search results
    const searchUsers = async (text) => {
        setLoading();
        const params = new URLSearchParams({
            q: text,
        });
        // Make a fetch request to the GitHub API.
        const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        // Parse the JSON response.
        const { items } = await response.json();

        dispatch({
            type: 'GET_USERS',
            payload: items
        })
    }

    // Get a single user by login/username.
    const getUser = async (login) => {
        setLoading();

        // Make a fetch request to the GitHub API.
        const response = await fetch(`${GITHUB_URL}/users/${login}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            });
        //Redirect to the not found page if the user is not found.
        if (response.status === 404) {
            window.location = '/notfound';
        } else {
            // Parse the JSON response.
            const data = await response.json();

            dispatch({
                type: 'GET_USER',
                payload: data,
            })
        }
    }

    //Get User repos
    const getUserRepos = async (login) => {
        setLoading();

        const params = new URLSearchParams({
            sort: 'created',
            per_page: 10,
        });

        // Make a fetch request to the GitHub API.
        const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        // Parse the JSON response.
        const data = await response.json();

        dispatch({
            type: 'GET_REPOS',
            payload: data,
        })
    }

    const clearUsers = () => dispatch({ type: 'CLEAR_USERS' })

    const setLoading = () => dispatch({ type: 'SET_LOADING' })



    // Return the provider component, passing in the context data.
    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                user: state.user,
                loading: state.loading,
                repos: state.repos,
                searchUsers,
                clearUsers,
                getUser,
                getUserRepos,
            }}>
            {children}
        </GithubContext.Provider>
    );
};

// Export the context object.
export default GithubContext
