import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './rules.css';

const Rules = () => {
    // eslint-disable-next-line
    const [cameraAccessGranted, setCameraAccessGranted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const user = location.state?.user || JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            // Redirect to login if user is not available
            navigate('/login');
        }
    }, [user, navigate]);

    const goFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    };

    const requestCameraAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraAccessGranted(true);
            // Display camera feed in a corner (this can be handled in the /exam route)
            document.getElementById('camera-feed').srcObject = stream;
            // Navigate to the exam portal
            navigate('/exam');
        } catch (error) {
            alert('Camera access is required to proceed with the exam.');
        }
    };

    const startExam = () => {
        try {
            // Send the recorded video to Django backend
            const response = fetch(`http://127.0.0.1:8000/students/remove_activity/${user.id}`, {
              method: 'GET',
            });
      
            if (response.ok) {
              console.log("Activity removed successfully");
            } else {
              console.error("No Activity Found:", response.statusText);
            }
          } catch (error) {
            console.error("Error found:", error);
          }
        goFullScreen();
        // Request camera access and navigate if granted
        requestCameraAccess();
    };

    const handleLogout = () => {
        // Clear the session (localStorage or sessionStorage)
        localStorage.removeItem('user');
        // Navigate to the login page
        navigate('/');
    };

    return (
        <>
            <div className='rules-records'>
                {user && (
                    <strong>Hello {user.username}, Please read the rules carefully!</strong>
                )}
                <h1>Exam Rules</h1>
                <ul>
                    <li><strong>Time Restriction:</strong> You will get 1 minute to answer each question. The timer will start as soon as you begin the exam.</li>
                    <li><strong>Attempt:</strong> You can submit the quiz once you have completed all the questions and reached the end.</li>
                    <li><strong>Navigation:</strong> You can navigate between questions using the "Next" and "Previous" buttons. Once you submit, you cannot return to previous questions.</li>
                    <li><strong>Answer Submission:</strong> Ensure you select an answer for each question before submitting the exam. Unanswered questions will prompt a warning before submission.</li>
                    <li><strong>Prohibited Actions:</strong> Do not open other browser tabs or applications during the exam. Doing so may result in disqualification.</li>
                    <li><strong>Technical Issues:</strong> If you experience technical issues, notify the exam proctor immediately. The time lost due to technical issues will not be compensated.</li>
                    <li><strong>Cheating:</strong> Any form of cheating or using unauthorized resources will result in disqualification.</li>
                    <li><strong>Personal Identification:</strong> You may be required to verify your identity before starting the exam. Make sure to have valid ID ready if required.</li>
                    <li><strong>Exam Environment:</strong> Ensure you are in a quiet and distraction-free environment. Keep your workspace clear of any notes or books.</li>
                    <li><strong>Compliance:</strong> By starting the exam, you agree to adhere to the rules and regulations set forth by the examination authorities.</li>
                </ul>
            </div>
            <div className="start-button">
                <button onClick={handleLogout}>Logout</button>
            </div>
            <button onClick={startExam}>Start Exam</button>

            {/* Hidden video element to display the camera feed */}
            <video id="camera-feed" style={{ position: 'fixed', top: '10px', right: '10px', width: '200px', height: '150px', zIndex: '9999' }} autoPlay></video>
        </>
    );
};

export default Rules;
