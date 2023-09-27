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

    const setLoading = () => dispatch({ type: 'SET_LOADING' })



    // Return the provider component, passing in the context data.
    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                loading: state.loading,
                searchUsers
            }}>
            {children}
        </GithubContext.Provider>
    );
};

// Export the context object.
export default GithubContext
