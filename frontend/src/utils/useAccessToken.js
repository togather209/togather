import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessTokenAsync, setToken } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const useAccessToken = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector(state => state.auth.accessToken);
    const [localAccessToken, setLocalAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const refeshTokenIfNeeded = async () => {
            if (!accessToken) {
                try {
                    const resultAction = await dispatch(refreshAccessTokenAsync()).unwrap();
                    setLocalAccessToken(resultAction.accessToken);
                    dispatch(setToken(resultAction));
                } catch (error) {
                    console.error("Failed to refresh access token", error);
                    alert("서비스 이용을 위해 로그인을 해주세요.");
                    navigate("/login");
                }
            } else {
                setLocalAccessToken(accessToken);
            }
            setLoading(false);
        };

        refeshTokenIfNeeded();
    }, [accessToken, dispatch, navigate]);

    return { localAccessToken, loading };
};

export default useAccessToken;
