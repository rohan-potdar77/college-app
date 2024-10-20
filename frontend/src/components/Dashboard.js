import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useEffect, useState } from "react";

const useStyles = makeStyles({
  collegeBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    minHeight: "12rem",
    borderRadius: "5px",
    boxShadow: "1px 4px 8px rgb(100, 100, 100)",
  },
  collegeGrid: {
    padding: 5,
  },
  buttonList: {
    marginInlineStart: 2,
  },
});

const Dashboard = ({ setAuthentication }) => {
  const classes = useStyles();

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [courses, setCourses] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const apiClient = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true,
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const handleOpenDialog = (college = null) => {
    if (college) {
      setSelectedCollege(college);
      setCollegeName(college.name);
      setCollegeLocation(college.location);
      setCourses(college.courses || []);
    } else {
      setCollegeName("");
      setCollegeLocation("");
      setCourses([{ course: "", fee: "" }]);
      setSelectedCollege(null);
    }
    setIsCreating(!college);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCollege(null);
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/colleges/${selectedCollege._id}`, {
        name: collegeName,
        location: collegeLocation,
        courses,
      });
      setColleges((prev) =>
        prev.map((col) =>
          col._id === selectedCollege._id
            ? { ...col, name: collegeName, location: collegeLocation, courses }
            : col
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to update college:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await apiClient.post("/colleges", {
        name: collegeName,
        location: collegeLocation,
        courses,
      });
      setColleges((prev) => [...prev, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to create college:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/colleges/${id}`);
      setColleges((prev) => prev.filter((col) => col._id !== id));
    } catch (error) {
      console.error("Failed to delete college:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setAuthentication(false);
  };

  const handleCourseChange = (index, field, value) => {
    setCourses((prevCourses) =>
      prevCourses.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      )
    );
  };

  const handleAddCourse = () => {
    setCourses([...courses, { course: "", fee: "" }]);
  };

  const handleRemoveCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await apiClient.get("/colleges");
        setColleges(response.data);
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container marginTop={1} rowSpacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" textTransform="uppercase">
            college list overview
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
          <ButtonGroup>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => handleOpenDialog()}
            >
              Add
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ButtonGroup>
        </Grid>

        {colleges.map((college) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={college._id}
            className={classes.collegeGrid}
          >
            <Box className={classes.collegeBox}>
              <Typography variant="h6">{college.name}</Typography>
              <Typography variant="body1">{college.location}</Typography>
              {college?.courses?.map((course) => (
                <Typography key={course._id} variant="body2">
                  {course.course} [Fees: Rs.{course.fee}]
                </Typography>
              ))}
              <ButtonGroup>
                <Button
                  size="small"
                  color="secondary"
                  variant="outlined"
                  onClick={() => handleOpenDialog(college)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={() => handleDelete(college._id)}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Creating/Updating College */}
      <Dialog maxWidth="xs" open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isCreating ? "ADD" : "EDIT"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Name"
            margin="dense"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Location"
            value={collegeLocation}
            onChange={(e) => setCollegeLocation(e.target.value)}
          />

          {courses.map((course, index) => (
            <Box key={index} mb={2}>
              <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Course"
                value={course.course}
                onChange={(e) =>
                  handleCourseChange(index, "course", e.target.value)
                }
              />

              <TextField
                fullWidth
                label="Fee"
                size="small"
                type="number"
                margin="dense"
                value={course.fee}
                onChange={(e) =>
                  handleCourseChange(index, "fee", e.target.value)
                }
              />

              {courses.length > 1 && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveCourse(index)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={handleAddCourse}
          >
            Add Course
          </Button>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={isCreating ? handleCreate : handleUpdate}
          >
            {isCreating ? "CREATE" : "SAVE"}
          </Button>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
