import React, { useState, useEffect, useContext } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import UserContext from "../context/UserContext";

export default function CommentSection({ postId }) {
    const { user } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [updatedContent, setUpdatedContent] = useState("");

    // Fetch comments for the post
    useEffect(() => {
        fetch(`http://localhost:4000/comments/blog/${postId}`)
            .then(res => res.json())
            .then(data => setComments(data.comments))
            .catch(err => console.error("Error fetching comments:", err));
    }, [postId]);

    // Handle adding a new comment
    const handleAddComment = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        fetch(`http://localhost:4000/comments/`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                content: newComment, 
                blog: postId 
            }),
        })
        .then(res => res.json())
        .then(data => {
            setComments(prevComments => [...prevComments, data.comment]);
            setNewComment("");
        })
        .catch(err => console.error("Error adding comment:", err));
    };

    // Handle editing a comment
    const handleEditComment = (commentId) => {
        const token = localStorage.getItem("token");

        fetch(`http://localhost:4000/comments/${commentId}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                content: updatedContent 
            }),
        })
        .then(res => res.json())
        .then(data => {
            setComments(prevComments => 
                prevComments.map(comment => 
                    comment._id === commentId ? data.comment : comment
                    // comment.id === commentId ? data.comment : comment
                )
            );
            setEditingComment(null);
            setUpdatedContent("");
        })
        .catch(err => console.error("Error updating comment:", err));
    };

    // Handle deleting a comment
    const handleDeleteComment = (commentId) => {
        const token = localStorage.getItem("token");

        if (window.confirm("Are you sure you want to delete this comment?")) {
            fetch(`http://localhost:4000/comments/${commentId}/delete`, { 
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
            })
            .catch(err => console.error("Error deleting comment:", err));
        }
    };

    return (
        <div className="mt-5">
            <h6>Comments</h6>
            <ListGroup>
                {comments.map(comment => (
                    <ListGroup.Item key={comment._id}>
                        <strong>{ comment.author?.username || "Anonymous" }:</strong> 
                        {editingComment === comment._id ? (
                            <>
                                <Form.Control 
                                    type="text"
                                    value={updatedContent}
                                    className="mt-2"
                                    onChange={(e) => setUpdatedContent(e.target.value)}
                                    required
                                />
                                <Button size="sm" variant="success" className="mt-2 m-1" onClick={() => handleEditComment(comment._id)}>
                                    Save
                                </Button>
                                <Button size="sm" variant="secondary" className="mt-2 m-1" onClick={() => setEditingComment(null)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                {comment.content}
                                {user && (user._id === comment.author?.id || user.isAdmin) ? (
                                    <div className="d-flex justify-content-end mt-2">
                                        <Button 
                                            size="sm" 
                                            variant="warning" 
                                            className="me-2" 
                                            onClick={() => {
                                                setEditingComment(comment._id);
                                                setUpdatedContent(comment.content);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        
                                        <Button 
                                            size="sm" 
                                            variant="danger" 
                                            onClick={() => handleDeleteComment(comment._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ) : null
                                }
                            </>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {user ? (
                <Form onSubmit={handleAddComment} className="mt-3">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3" size="sm">
                        Add Comment
                    </Button>
                </Form>
            ) : (
                <p className="text-muted mt-3">Log in to add a comment.</p>
            ) }
        </div>
    );
}
