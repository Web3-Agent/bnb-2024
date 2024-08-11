import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import sal from "sal.js";
import Button from "../ui/Button";
import axios from "axios";
import BuildMessage from "./ImageRender";
import Loader from "./Loader";
import ImageRender from "./ImageRender";

const LOADER_DEFAULT_STATE = {
    action: 'default',
    loading: false
}
const PROMPT_DEFAULT_STATE = {
    prompt: 'Imagine a striking scene of a feline. The cat features a unique touch - it has enchanting red eyes that glow vibrantly. Its eyes radiate an intense red hue, strangely captivating and mysterious. The cat itself is a visual delight, with its body showcasing a splendid display of its natural form and meticulously detailed fur. The overall setting enhances the uniqueness of the cat, adding to its majestic aura.'
}

const ImageGenerator = () => {
    const [_web3, _setWeb3] = useState("");
    const [loader, setLoader] = useState(LOADER_DEFAULT_STATE);
    const [ImageForm, setImageForm] = useState(PROMPT_DEFAULT_STATE);
    const [chatGPTRawResponse, setChatGPTRawResponse] = useState({});
    const getChatGptResponse = async () => {
        setLoader((prev) => ({
            ...prev,
            action: 'generate',
            loading: true
        }))
        setChatGPTRawResponse({})
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/image-generator`, ImageForm);
            console.log('👉🏻 Line 48 : ', data);
            if (data?.data?.length) {
                setChatGPTRawResponse(data.data[0])
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoader((prev) => ({
                ...prev,
                action: 'default',
                loading: false
            }))
        }
    }

    useEffect(() => {
        sal();
    }, []);
    const promptLength = ImageForm?.prompt?.length || 0;
    return (
        <>
            <div className="rbt-main-content mr--0 mt--30">
                <div className="rbt-daynamic-page-content">
                    <div className="rbt-dashboard-content">
                        <div className="content-page">
                            <div className="chat-box-list">
                                <div className="rainbow-generartor-section rainbow-section-gap">
                                    <div
                                        className="section-title text-center sal-animate"
                                        data-sal="slide-up"
                                        data-sal-duration="700"
                                        data-sal-delay="100"
                                    >
                                        <h4 className="subtitle ">
                                            <span className="theme-gradient">Web3Agent</span>
                                        </h4>
                                        <h3 className="title w-600 mb--10">
                                            Unleashing the Power of Web3 with AI
                                        </h3>
                                        <p className="description b3">
                                            We provide Mastering the Art of generating and deploying{" "}
                                            <br />
                                            NFT using simple prompts with AI.
                                        </p>
                                    </div>
                                    <div className="genarator-section">
                                        <div className="row border-gradient p-4">
                                            <div className="col-4">
                                                <div className="row">
                                                    <div className="col-12 d-grid">
                                                        <label htmlFor="contract-textarea" className="form-label">Add Prompt</label>
                                                        <div className="border-gradient">

                                                            <textarea style={{ minHeight: "460px" }} className="fs-4" id="contract-textarea" rows="10" value={ImageForm.prompt} onChange={(e) => { setImageForm((prev) => ({ ...prev, prompt: e.target.value })) }}></textarea>
                                                        </div>
                                                        <div className={`pt-2 px-1 fs-5 font-bold ${promptLength <= 4000 ? 'text-success' : 'text-danger'}`}>{ImageForm?.prompt?.length}/4000</div>
                                                        <Button btnClass={"btn btn-secondry border-gradient color-white p-3 mt-2 fs-4"} title="Generate Image" onClick={getChatGptResponse} loading={loader.action === 'generate' && loader.loading} disabled={(loader.action === 'generate' && loader.loading) || promptLength > 4000} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-8">
                                                <div className="row">
                                                    {(loader.loading) && <div className="col-12">
                                                        <Loader show={loader.loading} />
                                                    </div>
                                                    }
                                                    {!loader.loading && <div className="col-12  d-grid">
                                                        <ImageRender data={chatGPTRawResponse} />
                                                        <Button btnClass={"btn btn-secondry border-gradient color-white p-3 mt-2 fs-4"} title="Mint NFT" onClick={() => { }} loading={loader.action === 'mint-nft' && loader.loading} disabled={(loader.action === 'mint-nft' && loader.loading)} />

                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
};

export default ImageGenerator;
