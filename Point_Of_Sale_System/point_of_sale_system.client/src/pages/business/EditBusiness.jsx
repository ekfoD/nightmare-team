import EditForm from "./EditForm"

function EditBusiness() {
    const bussines = {
        name: "VACKACKA INDUSTRY",
        address: "Lithuania Kaunas Vilniaus g. 15",
        emailAddress: "danieliukas67@gmail.com",
        phoneNumber: "+37012345678",
        bussinesType: "service",
        currency: "€",
    }

    function handleFormSubmit(updatedData){
        console.log("Updated business:", updatedBusiness);
        // send to backend
    }
    return (
        <>
            <h1>Edit business</h1>
            <EditForm onSubmit={handleFormSubmit} business={bussines} />
        </>
    );
}

export default EditBusiness;