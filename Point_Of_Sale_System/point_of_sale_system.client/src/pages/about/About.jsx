import useAuth from "../../hooks/useAuth";

function About() {
    const { auth } = useAuth();

    const organizationId = auth.businessId;

    return (
        <>
            <h1>POS</h1>
            <p>Organization ID: {organizationId}</p>
        </>
    )
}

export default About;