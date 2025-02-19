import React, { useState, useEffect } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import FeaturedPosts from '../components/FeaturedPosts'

export default function Home() {
	const navigate = useNavigate();
	const [blogs, setBlogs] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:4000/blogs/posts`)
			.then(res => {
				if (!res.ok) {
				  throw new Error(`HTTP error! status: ${res.status}`);
				}

				return res.json();
			})
			.then(data => {
				console.log("Fetched blogs:", data);
		      	setBlogs(Array.isArray(data) ? data.slice(0, 3) : data.blogs?.slice(0, 3) || []);
			})
			.catch(err => {
				console.error('Error fetching blogs:', err);
			})
	}, []);


	const mainPage = () => {
    	navigate('/blogs');
	};

	return (
    <div className="container d-flex flex-column align-items-center text-center">
        {/*<Image src={logoBar1} alt="Lux Belle Perfume" width={400} style={{ marginTop: "30px" }} />*/}
    	<h1 className="text-center mt-5">Welcome to Threadify</h1>
        <p style={{ marginTop: "20px", fontStyle: "italic", fontSize: "18px"}} >
          <i>Weaving thoughts, connecting minds.</i>
        </p>

        <Button
          variant="primary"
          onClick={mainPage}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "30px",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Join the Conversation
        </Button>

        <div className="w-100 mt-4">
          <FeaturedPosts blogs={blogs} />
        </div>
    </div>
  );




}