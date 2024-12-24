import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

import { Comment } from './Comment'
import { Avatar } from './Avatar'

import styles from './Post.module.css'

export interface PostType {
    id: number;
    author: {
        name: string;
        role: string;
        avatarUrl: string;
    };
    publishedAt: Date;
    content: {
        type: 'paragraph' | 'link';
        content: string;
    }[];
}

interface PostProps {
    author: {
        name: string;
        role: string;
        avatarUrl: string;
    };
    publishedAt: Date;
    content: {
        type: 'paragraph' | 'link';
        content: string;
    }[];
}

export function Post (props: PostProps) {

    const [comments, setComments] = useState([""]);
    const [newComment, setNewComment] = useState("");

    const publishedDateFormatted = format(
        new Date(props.publishedAt), 
        "do LLLL 'at' hh:mm a"
    );

    const publishedDateDistanceToNow = formatDistanceToNow(
        new Date(props.publishedAt), 
        {addSuffix: true}
    );

    function handleNewComment(event: FormEvent) {
        event.preventDefault();

        setComments([...comments, newComment]);
        setNewComment('');
    }

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('');
        setNewComment(event.target.value);
    }

    function deleteComment(commentToDelete: string) {
        setComments(comments.filter(comment => comment !== commentToDelete));
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Comment is necessary!');
    }

    const isNewCommentEmpty = newComment.length === 0;

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={props.author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{props.author.name}</strong>
                        <span>{props.author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormatted} dateTime={props.publishedAt.toISOString()}>{publishedDateDistanceToNow}</time>
            </header>

            <div className={styles.content}>
            {props.content.map(line => {
                switch(line.type) {
                    case 'paragraph':
                        return <p key={line.content}>{line.content}</p>;
                    case 'link':
                        return (
                            <p key={line.content}>
                                <a href={line.content} target="_blank" rel="noopener noreferrer">
                                    {line.content}
                                </a>
                            </p>
                        );
                    default:
                        return null;
                }
            })}

            </div>

            <form onSubmit={handleNewComment} className={styles.commentForm}>
                <strong>Comments</strong>

                <textarea
                    name="comment"
                    value={newComment}
                    placeholder="Add you comment..."
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                <footer>
                    <button type="submit" disabled={isNewCommentEmpty}>Comment</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                    <Comment 
                        key={comment} 
                        content={comment} 
                        onDeleteComment={deleteComment}
                    />
                    )
                })}
            </div>
        </article>
    );
}