 const saveNodes = async(data:any)=>{
    try {
        const response = await fetch(``,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(data),
        });
        const responseData =await response.json();
        return responseData;
    } catch (error) {
        window.alert(`Error: ${error}`)
    }
 }