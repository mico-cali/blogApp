import React, { useState, useContext } from "react";
import { Form, Button, Card } from "react-bootstrap";
import UserContext from "../context/UserContext";

export default function AddPost({ onPostAdded }) {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem("token");

        fetch("https://blogapp-server-7qfm.onrender.com/blogs/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                title, 
                content 
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to add post");
                }
                return res.json();
            })
            .then((newPost) => {
                onPostAdded(newPost);
                setTitle("");
                setContent("");
            })
            .catch((error) => {
                console.error("Error adding post:", error);
                alert("Failed to add post.");
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <Card className="mb-4 shadow border-0 rounded-3 p-3">
            <Card.Body className="d-flex">
                <Form className="flex-grow-1" onSubmit={handleSubmit}>
                
                    <Form.Group className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-0 shadow-sm"
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border-0 shadow-sm"
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-2">
                        <Button type="submit" variant="primary" disabled={submitting}>
                            {submitting ? "Posting..." : "Add Post"}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}
