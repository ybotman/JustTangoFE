import { TextField, Button } from '@mui/material';

// In your component
<form onSubmit={handleSubmit}>
    <TextField label="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
    <TextField label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
    <Button type="submit">Register</Button>
</form>
