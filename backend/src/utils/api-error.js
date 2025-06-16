class ApiError extends Error{
    constructor(
        statusCode, 
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message); // compulsory
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
    }

}

export default ApiError;

// Key Points about Error.captureStackTrace:
// Purpose: It removes the specified function (usually the constructor) from the stack trace, making error traces cleaner and more useful for debugging.
// Parameters:

// First parameter: The target object (usually this)
// Second parameter: The function to exclude from the stack trace