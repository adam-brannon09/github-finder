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

    // Define a function to fetch users from GitHub.
    const fetchUsers = async () => {
        setLoading();
        // Make a fetch request to the GitHub API.
        const response = await fetch(`${GITHUB_URL}/users`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        // Parse the JSON response.
        const data = await response.json();

        dispatch({
            type: 'GET_USERS',
            payload: data
        })
    }

    const setLoading = () => dispatch({ type: 'SET_LOADING' })

    // Return the provider component, passing in the context data.
    return (
        <GithubContext.Provider
            value={{
                users: state.users,
                loading: state.loading,
                fetchUsers
            }}>
            {children}
        </GithubContext.Provider>
    );
};

// Export the context object.
export default GithubContext
