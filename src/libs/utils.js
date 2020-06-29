class Utils {
    
    validateParams(requiredParams, params, exact) {
        // Exact check
        if (exact && Object.keys(requiredParams).length !== Object.keys(params).length) {
            return { err: { message: 'Number of keys are not equal' } };
        }

        for (let [k, v] of Object.entries(requiredParams)) {
            if (params[k] === undefined) {
                return { err: { message: 'Required key doesnt exist ' + k } };
            }

            // if (!Object.keys(v).includes('default')) { // If object (without default)
            //     let interRes = this.validateParams(v, params[k], exact);
            //     if (interRes.err) {
            //         return interRes;
            //     }
            // } else {
                // If primitive
                // Check if key exists
                if (params[k] === undefined) {
                    if (v.default === null) {
                        return { err: { message: `Required key doesn't exist ${k}` } };
                    }
                    params[k] = v.default;
                }

                // Check if type matches
                if (Array.isArray(v.type)) {
                    // 
                    if (typeof params[k] === 'string' && !params[k].length) {
                        return { err: { message: `${k} ${typeof params[k]} is Blank` } };
                    }

                    // Handles type -> array
                    if (v.type.includes('array') && !v.type.includes(typeof params[k]) && !Array.isArray(params[k])) {
                        if (v.default === null) {
                            return { err: { message: `Key Type doesn't match ${k}` } };
                        }
                        params[k] = v.default;
                    }

                    // Handles type -> other than array (all)
                    if (!v.type.includes('array') && !v.type.includes(typeof params[k])) {
                        if (v.default === null) {
                            return { err: { message: `Key Type doesn't match ${k}` } };
                        }
                        params[k] = v.default;
                    }

                    // Handles length
                    if (v.length && params[k].length > v.length) {
                        return { err: { message: `${k} key length doesn't match, length should not be greater than ${v.length}` } };
                    }
                } else {
                    // 
                    if (typeof params[k] === 'string' && !params[k].length) {
                        return { err: { message: `${k} ${typeof params[k]} is Blank` } };
                    }

                    // Handles type -> array
                    if (v.type === 'array' && !Array.isArray(params[k])) {
                        if (v.default === null) {
                            return { err: { message: `Key Type doesn't match ${k}` } };
                        }
                        params[k] = v.default;
                    }

                    // Handles type -> other than array (all)
                    if (v.type !== 'array' && typeof params[k] !== v.type) {
                        if (v.default === null) {
                            return { err: { message: `Key Type doesn't match ${k}` } };
                        }
                        params[k] = v.default;
                    }
                    // Handles length
                    if (v.length && params[k].length > v.length) {
                        return { err: { message: `${k} key length doesn't match, length should not be greater than ${v.length}` } };
                    }
                }
            // }
        }

        // Returns
        return params;
    }


    /** Invoker handling try-catch */
    async invoker(prom) {
        try {
            const result = await prom;
            return ({
                err: null,
                result: result
            });
        } catch (err) {
            return ({
                err: err,
                result: null
            });
        }
    }
}

export default Utils;