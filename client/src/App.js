import PostCreate from './component/posts-create.component';
import PostList from './component/posts-list.component';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
}

export default App;
