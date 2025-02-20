import React, { useContext, useState } from 'react';
import { Card, Button, Modal, Container, Row, Col, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import CommentSection from '../components/CommentSection';

export default function BlogPostCard({ blog, onDelete}) {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [deleting, setDeleting] = useState(false); 
	const [editing, setEditing] = useState(false); 
	const [showFullPost, setShowFullPost] = useState(false);

	const [editedTitle, setEditedTitle] = useState(blog.title);
	const [editedContent, setEditedContent] = useState(blog.content);

	const handleEditModalOpen = () => {
		setEditedTitle(blog.title);
		setEditedContent(blog.content);
		setEditing(true);
		setShowFullPost(false); 
	};

	const handleEditModalClose = () => setEditing(false);


	const handleEdit = (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");

		fetch(`https://blogapp-server-7qfm.onrender.com/blogs/posts/${blog._id}/update`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				title: editedTitle,
				content: editedContent,
			}),
		})
		
		.then((res) => {
			if (!res.ok) {
				return res.json().then((err) => {
					throw new Error(err.message);
				});
			}

			return res.json();
		})

		.then((data) => {
			console.log("Post updated:", data);
			// Update the UI with new data
			blog.title = editedTitle;
			blog.content = editedContent;
			
			handleEditModalClose();
		})
		.catch((error) => {
			console.error("Error updating post:", error);
			alert(error.message);
		});

	};

	const handleDelete = () => {
		const token = localStorage.getItem("token");

		if (window.confirm("Are you sure you want to delete this post?")) {
		  fetch(`https://blogapp-server-7qfm.onrender.com/blogs/posts/${blog._id}.delete`, {
		    method: 'DELETE',
		    headers: {
		      'Authorization': `Bearer ${token}`,
		    },
		  })
		    .then((res) => {
		        if (!res.ok) {
		            return res.json().then((err) => {
		            	throw new Error(err.message)
		            });
		        }
		        return res.json()
		    })
		    .then((data) => {
		        // Handle successful delete (e.g., refresh blog list)
		        console.log("Post deleted:", data);
		        // window.location.reload();
		        if (typeof onDelete === 'function') {
	            	onDelete(blog._id);
	          	}
		    })
		    .catch((error) => {
		        console.error('Error deleting post:', error);
		        alert(error.message)
		    });
		}

	};

	// Check if the current user is the author or an admin
	// const isAuthorOrAdmin = 
	// user &&  // to make sure there is a current user logged in
	// // (user.isAdmin || //check if the logged in user is admin 
	// (blog.author || blog.author._id || blog.author._id.toString() === user._id?.toString());

	const isAuthorOrAdmin = 
		user &&  // Ensure a user is logged in
		(user.isAdmin || (blog.author?.id?.toString() === user._id?.toString()));



	const handleShowFullPost = () => setShowFullPost(true);
	const handleCloseFullPost = () => setShowFullPost(false);

	return (
		<>
		<Card className="mb-4 shadow border-0 rounded-3">
			<Card.Body>
				<Card.Title className="mb-2">{blog.title}</Card.Title>
				<Card.Text className="text-muted small mb-3">
					Posted by {blog.author?.username || "Anonymous"} on {new Date(blog.createdAt).toLocaleDateString() || "Date Unavailable"}
				</Card.Text>
				<Card.Text>
					{blog.content.length > 200 ? blog.content.slice(0, 200) + '...' : blog.content}
				</Card.Text>
				<div className="d-flex justify-content-between align-items-center">
{/*					<div>
						<Button variant="outline-dark" size="sm">Comment</Button>
					</div>*/}

					<div>
						<Button variant="primary" size="sm" onClick={handleShowFullPost}>
							Read More
						</Button>
					</div>
				</div>
			</Card.Body>
		</Card>

		{/* Modal for Full Post */}
		<Modal show={showFullPost} onHide={handleCloseFullPost} size="lg">
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
			<Modal.Footer className="d-flex justify-content-between">
					{isAuthorOrAdmin && (
						<div className="d-flex">
							<Button 
								variant="warning" 
								className="me-2" 
								onClick={handleEditModalOpen}
							>
								Edit
							</Button>
							<Button
								variant="danger"
								onClick={handleDelete}
								disabled={deleting}
							>
								{deleting ? 'Deleting...' : 'Delete'}
							</Button>
						</div>
					)}
					<Button variant="secondary" onClick={handleCloseFullPost}>
						Close
					</Button>
			</Modal.Footer>
		</Modal>

		{/* For Edit Post */}
		<Modal show={editing} onHide={handleEditModalClose} centered>
			<Form onSubmit={handleEdit}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Post</Modal.Title>
				</Modal.Header>
				
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Title</Form.Label>
						<Form.Control
							type="text"
							value={editedTitle}
							onChange={(e) => setEditedTitle(e.target.value)}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Content</Form.Label>
						<Form.Control
							as="textarea"
							rows={8}
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							required
						/>
					</Form.Group>
				</Modal.Body>
				
				<Modal.Footer>
					<Button variant="secondary" onClick={handleEditModalClose}>
						Cancel
					</Button>
					<Button variant="success" type="submit">
						Save Changes
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
		</>
  ); 

}