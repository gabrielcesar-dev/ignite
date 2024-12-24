import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Post, PostType } from './components/Post';

import './global.css'
import styles from './App.module.css'

import posts from './database/posts.json'



export function App() {
  const typedPosts: PostType[] = posts.map(post => ({
    ...post,
    publishedAt: new Date(post.publishedAt),
    content: post.content.map(contentItem => ({
      ...contentItem,
      type: contentItem.type as 'paragraph' | 'link',
    })),
  }));

  return (
    <div>
      <Header />

      <div className={styles.wrapper}>
        <Sidebar />

        <main>
        {typedPosts.map(post => (
          <Post 
            key={post.id}
            author={post.author}
            content={post.content}
            publishedAt={post.publishedAt}
          />
      ))}

        </main>

      </div>

    </div>
  );
}


