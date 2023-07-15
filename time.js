exports.getDate = () => {
    const today = new Date();
    const option = {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long"
    }
    return today.toLocaleDateString("en-US", option);
    
};
exports.getDay = ()=>{
    const today = new Date();
    const option = {
        weekday: "long"
    }
    return today.toLocaleDateString("en-US", option);
    
};
exports.getTime = ()=>{
    const today = new Date();
    const option = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    }
    return today.toLocaleDateString("en-US", option);
};