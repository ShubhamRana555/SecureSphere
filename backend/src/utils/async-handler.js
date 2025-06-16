// To handle try-catch properly in async functions

function asyncHandler (requestHandler){
    return function (req, res, next){
        Promise.resolve(requestHandler(req, res, next))
            .catch(function (err){
                next(err);
            });
    }
}

export default asyncHandler;