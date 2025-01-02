import { FC, useEffect } from "react";
import { useNavigate } from "react-router";


export const Redirect: FC<{ to: string }> = ({ to }) => {
    let navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    });
    return null;
}