import React, { useEffect, useState } from 'react';

const OrganizersList = () => {
    const [organizers, setOrganizers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/organizers')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched organizers:', data);
                setOrganizers(data);
            })
            .catch(error => {
                console.error('Error fetching organizers:', error);
            });
    }, []);

    return (
        <div>
            <h1>Organizers List</h1>
            <ul>
                {organizers.map(organizer => (
                    <li key={organizer._id}>{organizer.organizerName}</li>
                ))}
            </ul>
        </div>
    );
};

export default OrganizersList;