import React, { useState } from 'react';
import { Card, Modal, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';


export default function Home({ blogs }) {
	
	const [activeBlog, setActiveBlog] = useState(null);

	if (!blogs || blogs.length === 0) {
    	return <p>No featured posts yet.</p>;
  	}

  	const handleShowFullPost = (blogId) => setActiveBlog(blogId);
  	const handleCloseFullPost = () => setActiveBlog(null);

	return (
		<div className="featured-blogs-container">
			<hr />
			<h1 className="mb-4 mt-5">Featured Posts</h1>
			{blogs.map((blog) => (
				<Card 
					key={blog._id} 
					className="mb-4 shadow border-0 rounded-3"
					style={{ border: '1px solid #f0f0f0', borderRadius: '12px', transition: 'transform 0.2s ease' }}
					onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
					onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
				>
					<Card.Body>
						<div className="d-flex align-items-center mb-3 mt-2 justify-content-between">
							<h6 className="mb-0" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
								{blog.author?.username || "Anonymous"}
							</h6>
							<small className="text-muted">{new Date(blog.createdAt).toLocaleDateString() || "Date Unavailable"}</small>
						</div>
						<Card.Text 
							className="blog-content mt-2" 
							style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: '#555' }}
						>
							{blog.content.length > 200 ? `${blog.content.slice(0, 250)}...` : blog.content}
						</Card.Text>
						<a 
							className="btn btn-outline-primary btn-sm mt-3"
							onClick={() => handleShowFullPost(blog._id)}
							style={{ fontSize: '0.85rem', fontWeight: '500' }}
						>
							Read More
						</a>
					</Card.Body>

					{/* Modal for Full Post */}
					<Modal show={activeBlog === blog._id} onHide={handleCloseFullPost} size="lg">
						<Modal.Header closeButton>
							<Modal.Title>{blog.title}</Modal.Title>
						</Modal.Header>
						
						<Modal.Body>
							<Container>
								<Row>
									<Col md={12}>
										<Card>
											<Card.Body>
												<Card.Text className="text-muted small mb-3">
													Posted by {blog.author?.username || "Anonymous"} on {new Date(blog.createdAt).toLocaleDateString() || "Date Unavailable"}
												</Card.Text>
												
												<Card.Text style={{ fontSize: '18px' }}>{blog.content}</Card.Text> 

												<CommentSection postId={blog._id} />

											</Card.Body>
										</Card>
									</Col>
								</Row>
							</Container>
						</Modal.Body>
					</Modal>
				</Card>
			))}
		</div>
	);
}