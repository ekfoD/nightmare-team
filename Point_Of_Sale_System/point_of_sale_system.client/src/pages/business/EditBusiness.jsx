import EditForm from "./EditForm"

function EditBusiness() {
    const bussines = {
        name: "VACKACKA INDUSTRY",
        address: "Lithuania Kaunas Vilniaus g. 15",
        emailAddress: "danieliukas67@gmail.com",
        phoneNumber: "+370676767",
        bussinesType: "order-service",
        currency: "$",
    }
    return (
        <>
            <h1>Edit business</h1>
            <EditForm></EditForm>
        </>
    );
}

export default EditBusiness;