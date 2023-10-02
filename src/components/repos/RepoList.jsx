import PropTypes from 'prop-types'
import RepoItem from './RepoItem'



function RepoList({ repos }) {
    return (
        <div className="rounded-lg shadow-lg card bg-base-100">
            <div className="card-body">
                <h2 className="text-3xl my-4 font-bold card-title">
                    Latest Repos
                </h2>
                {repos.map((repo) => (
                    <RepoItem repo={repo} key={repo.id} />
                ))}

            </div>
        </div>
    )


}

RepoList.propTypes = {
    repos: PropTypes.array.isRequired,
}
export default RepoList