import React from "react";
import styles from "./BackgroundImage.module.css";

function BackgroundImage() {
  return (
    <div className={styles.backgroundImages}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf45f7fec0c18a73f30d2a21c3673cb1cad55c93"
        alt="Palm tree background"
        className={styles.bgPalm}
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d8ce44c7da49ad93f7def685cc014f32998c50a"
        alt="Beach background"
        className={styles.bgBeach}
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c57f055dd12cda3cdd5d51b47b8ea93581b6988"
        alt="Cactus background"
        className={styles.bgCactus}
      />
    </div>
  );
}

export default BackgroundImage;
