import React from "react";
import "./referencearticle.scss";
import link from "../../../assets/icons/link.svg";
import files from "../../../assets/icons/files.svg";
import plusIcon from "../../../assets/icons/round-add.svg";
import minusIcon from "../../../assets/icons/round_minus.svg";

function ReferenceArticle() {
  return (
    <>
      <div className="reference-wrapper">
        <p className="title">Share your reference data</p>
        <p className="subtitle">
          Share the most relevant and useful content for your blog. It can be a
          research paper PDF or a useful external link
        </p>

        <div className="collect-data">
          {/* Left side external url section  */}
          <div className="external-url">
            <p className="heading">
              <span>
                <img src={link} alt="url" />
              </span>
              Reference External URLs<span className="required">*</span>
            </p>

            <div className="enter-links">
              <input type="text" name="" id="" placeholder="Add links here" />
              <span className="plus-icon">
                <img src={plusIcon} alt="plus" />
              </span>
            </div>

            <div className="show-links">
              <div className="individual-link">
                <div className="title-link">
                  <p className="title">
                    EXPLORING GPT4O: THE FUTURE OF MULTIMODAL AI
                  </p>
                  <p className="link">
                    https://www.creolestudios.com/exploring-gpt4o-future-mu
                  </p>
                </div>
                <div className="delete-link">
                  <img src={minusIcon} alt="remove" />
                </div>
              </div>
            </div>
          </div>

          {/* Right side upload files section */}
          <div className="upload-files">
            <p className="heading">
              <span>
                <img src={files} alt="file" />
              </span>
              Reference Files<span className="required">*</span>
            </p>

            <div className="upload-input">
              <input
                type="text"
                name=""
                id=""
                placeholder="Upload Files from computer"
              />
              <span className="plus-icon">
                <img src={plusIcon} alt="plus" />
              </span>
            </div>

            <div className="show-files">
              <div className="individual-file">
                <p className="title">Future of AI and Chat GPT.PDF</p>
                <img src={minusIcon} alt="remove" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="back-next-btns">
        <button className="back-btn">Back</button>
        <button className="next-btn">Next</button>
      </div>
    </>
  );
}

export default ReferenceArticle;
