import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const Protected = ({ children }: React.PropsWithChildren) => {

    const user = useSelector((state: any) => state.auth.user);
    const loading = useSelector((state: any) => state.auth.loading);

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    if (!user) {
        return (
            <Navigate to={'/login'} />
        )
    }


    return (
        children
    )
}

export default Protected