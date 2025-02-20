import React, { useState, useEffect, useContext } from "react";
import { Spinner, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { GiSewingNeedle } from "react-icons/gi";

import UserContext from "../context/UserContext";
import BlogPostCard from "../components/BlogPostCard";
import AddPost from "../components/AddPost";


export default function Blogs() {
	const { user } = useContext(UserContext);

	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
 	const [error, setError] = useState(null);

	useEffect(() => {
	    setLoading(true);
	    setError(null);

		fetch(`https://blogapp-server-7qfm.onrender.com/blogs/posts`)
			.then(res => {
				if (!res.ok) {
				  throw new Error(`HTTP error! status: ${res.status}`);
				}

				return res.json();
			})
			.then(data => {
				console.log("Fetched blogs:", data);
				const blogData = Array.isArray(data) ? data : data.blogs || [];
				setBlogs(blogData);
			})
			.catch(err => {
				console.error('Error fetching blogs:', err);
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	
	const handleDeletePost = (deletedPostId) => {
    	setBlogs(blogs.filter(blog => blog._id !== deletedPostId));
    }

    const handleNewPost = (newPost) => {
    	setBlogs([newPost, ...blogs]);
	};

	// loading spinner animation
	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center vh-100">
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
		<Container className="my-4 justify-content-center"> {/* Main container */}
			<Row>
				<Col md={12}> {/* Blog posts column */}
					<h1 className="mb-5 mt-3"><GiSewingNeedle />Threadify Blog Posts</h1>
					{user && user.id ? ( 
			            <AddPost onPostAdded={handleNewPost} />
		          	) : null}
					
					{blogs.map((blog) => (
						<BlogPostCard key={blog._id} blog={blog} onDelete={handleDeletePost} />
					))}
				</Col>
			</Row>
		</Container>
		</>
	);
}