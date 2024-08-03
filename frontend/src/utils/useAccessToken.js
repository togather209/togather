import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessTokenAsync } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const useAccessToken = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector(state => state.auth.accessToken);
    //로컬환경에서만 accessToken을 변수로 사용할거(스토리지에 저장xxxxxxx)
    const [localAccessToken, setLocalAccessToken] = useState(accessToken);
    const navigate = useNavigate();

    useEffect(() => {
        const refeshTokenIfNeeded = async () => {
            if(!accessToken){
                const newAccessToken = await dispatch(refreshAccessTokenAsync());
                if(newAccessToken){
                    setLocalAccessToken(newAccessToken);
                }
                else{
                    alert("서비스 이용을 위해 로그인을 해주세요.");
                    console.log(newAccessToken);
                    //navigate("/login");
                }
            }
            else{
                setLocalAccessToken(accessToken);
            }
        }

        refeshTokenIfNeeded();
    }, [accessToken, dispatch, navigate]);

    return localAccessToken;
};

export default useAccessToken;