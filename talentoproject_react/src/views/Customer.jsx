import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Grid, Checkbox, FormControlLabel, Button, Card, CardContent, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useStateContext } from "../context/contextprovider"; // Assuming you're using a context for authentication

export default function Customer() {
  const talents = ["Singer", "Dancer", "Musician", "Band", "Entertainer", "DJ"];
  const { user } = useStateContext(); // Assuming you have a user context that holds the logged-in user details
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [postForm, setPostForm] = useState({
    id: null, // Track the post id when editing
    clientName: user ? user.name : "",
    eventName: "",
    startTime: "",
    endTime: "",
    description: "",
    talents: [],
  });
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [comments, setComments] = useState({}); // State to store comments per post

  // Fetch all posts from the Laravel API
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch comments for each post
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/comments`);
      const data = await response.json();
      return data; // Comments for the post
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  // Load posts and comments when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    posts.forEach(async (post) => {
      const commentsForPost = await fetchComments(post.id);
      setComments((prev) => ({ ...prev, [post.id]: commentsForPost }));
    });
  }, [posts]);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostForm({ ...postForm, [name]: value });
  };

  const handleEdit = (post) => {
    setPostForm({
      id: post.id,
      clientName: post.client_name,
      eventName: post.event_name,
      startTime: post.start_time,
      endTime: post.end_time,
      description: post.description,
      talents: Array.isArray(post.talents) ? post.talents : post.talents.split(","), // Ensure talents is an array
    });
    setShowFormPopup(true);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const requestData = { ...postForm };
    try {
      let response;
      if (postForm.id) {
        response = await fetch(`http://127.0.0.1:8000/api/posts/${postForm.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      } else {
        response = await fetch("http://127.0.0.1:8000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
      }

      if (response.ok) {
        setShowFormPopup(false);
        fetchPosts();
        setPostForm({
          id: null,
          clientName: user ? user.name : "",
          eventName: "",
          startTime: "",
          endTime: "",
          description: "",
          talents: [],
        });
      } else {
        console.error("Error saving post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchPosts();
        } else {
          console.error("Error deleting post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleTalentChange = (talent) => {
    setPostForm((prevForm) => {
      const updatedTalents = prevForm.talents.includes(talent)
        ? prevForm.talents.filter((t) => t !== talent)
        : [...prevForm.talents, talent];
      return { ...prevForm, talents: updatedTalents };
    });
  };

  // Submit comment for a specific post
  const handleCommentSubmit = async (postId) => {
    const comment = comments[postId]?.newComment || ""; // Get the new comment for this post
    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: user.id, // Send the currently logged-in user ID
          content: comment,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        // Update the comments array for the specific post
        setComments((prev) => ({
          ...prev,
          [postId]: [...prev[postId], newComment],
        }));
        setComments((prev) => ({
          ...prev,
          [postId]: { ...prev[postId], newComment: "" }, // Clear the input field
        }));
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-4">Book a Talent for Your Event!</h1>
      </header>

      <div className="text-center mt-4">
        <button onClick={() => setShowFormPopup(true)} className="p-2 bg-blue-500 text-white rounded-md">
          Submit a Request
        </button>
      </div>

      <div className="container mx-auto">
        <Typography variant="h6" gutterBottom>
          List of Submitted Requests:
        </Typography>

        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  {post.user?.image_profile ? (
                    <Avatar src={post.user.image_profile} alt={post.client_name} sx={{ marginRight: 2 }} />
                  ) : (
                    <Avatar sx={{ bgcolor: "#2196f3", marginRight: 2 }}>
                      <AccountCircleIcon />
                    </Avatar>
                  )}
                  <Typography variant="h6" component="div">
                    {post.client_name}
                  </Typography>
                </div>

                <Typography variant="body1" color="textPrimary">
                  <strong>Event Name:</strong> {post.event_name}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  <strong>From:</strong> {post.start_time} <strong>To:</strong> {post.end_time}
                </Typography>

                <Typography variant="body1" color="textPrimary">
                  <strong>Description:</strong> {post.description}
                </Typography>

                <Typography variant="body1" color="textPrimary">
                  <strong>Categories:</strong> {Array.isArray(post.talents) ? post.talents.join(", ") : post.talents}
                </Typography>

                {/* Comments Section */}
                  <Typography variant="body1" color="textPrimary" style={{ marginTop: 16 }}>
                    Comments:
                  </Typography>

                  {Array.isArray(comments[post.id]) ? (
                    comments[post.id].map((comment) => (
                      <div key={comment.id} style={{ marginTop: 8, paddingLeft: 16 }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>{comment.user?.name || "Anonymous"}:</strong> {comment.content}
                        </Typography>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No comments yet.
                    </Typography>
                  )}

                {/* Add Comment */}
                <div style={{ marginTop: 16 }}>
                  <TextField
                    fullWidth
                    label="Add Comment"
                    value={comments[post.id]?.newComment || ""}
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [post.id]: { ...prev[post.id], newComment: e.target.value },
                      }))
                    }
                    margin="normal"
                  />
                  <Button variant="contained" color="primary" onClick={() => handleCommentSubmit(post.id)}>
                    Submit Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      <Modal open={showFormPopup} onClose={() => setShowFormPopup(false)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            bgcolor: "white",
            width: "90%",
            maxWidth: "500px",
            margin: "auto",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {postForm.id ? "Edit Event" : "Create an Event"}
          </Typography>

          <TextField fullWidth label="Client Name" name="clientName" value={postForm.clientName} onChange={handlePostChange} margin="normal" disabled />
          <TextField fullWidth label="Event Name" name="eventName" value={postForm.eventName} onChange={handlePostChange} margin="normal" />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Start Time" type="time" name="startTime" value={postForm.startTime} onChange={handlePostChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="End Time" type="time" name="endTime" value={postForm.endTime} onChange={handlePostChange} InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>

          <TextField fullWidth label="Description" multiline rows={4} name="description" value={postForm.description} onChange={handlePostChange} margin="normal" />

          <Typography variant="h6" gutterBottom>
            Category:
          </Typography>
          <Box display="flex" flexWrap="wrap">
            {talents.map((talent) => (
              <FormControlLabel
                key={talent}
                control={<Checkbox checked={postForm.talents.includes(talent)} onChange={() => handleTalentChange(talent)} />}
                label={talent}
              />
            ))}
          </Box>

          <Button variant="contained" color="primary" onClick={handlePostSubmit} sx={{ mt: 2 }}>
            {postForm.id ? "Update" : "Submit"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
