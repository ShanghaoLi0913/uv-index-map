## Basic Concept

### **UV Index**

- The **UV Index** is a standardized scale developed by the World Health Organization (WHO) to measure the intensity of UV radiation from the sun at a specific location and time.
- It helps communicate the risk of overexposure to UV radiation for human skin.
- The scale typically ranges from 0 to 11+, where:
  - **0-2**: Low risk
  - **3-5**: Moderate risk
  - **6-7**: High risk
  - **8-10**: Very high risk
  - **11+**: Extreme risk
- The index is adjusted for factors such as altitude, cloud cover, and ozone levels.
- It is a tool for public awareness, guiding people on sun protection measures.

### **UV Irradiation**

- **UV Irradiation** (or UV Radiation) refers to the actual energy emitted in the ultraviolet spectrum, typically measured in units of power per area, such as watts per square meter (W/m2W/m^2W/m2).
- It is a physical measure of the UV energy reaching a surface.
- UV radiation is divided into three bands:
  1. **UVA (315-400 nm)**: Least harmful but penetrates deeper into the skin.
  2. **UVB (280-315 nm)**: Causes sunburn and is associated with skin cancer.
  3. **UVC (100-280 nm)**: Extremely harmful but absorbed by the Earth's atmosphere.
- UV irradiation values are used in scientific, environmental, and health studies to assess exposure levels, impact on ecosystems, and safety measures for UV-sensitive environments.

### UV index (UVI) Calculation

The UV index (UVI) is calculated using the formula:

![image-20241202154612077](image-20241202154612077.png)

Where:

- **E** represents the Erythemal UV Irradiance at ground level, measured in watts per square meter (W/m²). This is a measure of the UV radiation that reaches the Earth's surface and can potentially cause harm to human skin.
- **S** is the Scaling Factor, which converts the Erythemal UV Irradiance into the UV Index scale. The standard scaling factor used for UV Index calculation is 40.

The UV index value is simply the result of multiplying the erythemal UV irradiance (E) by 40.

Note: The dataset we found include **average UV irradiance at noon** in **milliwatts per square meter (mW/m²)**, so we need to convert the units of the irradiance to **watts per square meter (W/m²)** to match the standard formula.

Conversion from mW/m² to W/m²: `1 mW/m² = 0.001 W/m².`



# Dataset

## UV-2020-byState

source: https://ephtracking.cdc.gov/DataExplorer/#/

| StateFIPS | State      | CountyFIPS | County      | Year | Value                   | Data Comment |
| --------- | ---------- | ---------- | ----------- | ---- | ----------------------- | ------------ |
| state id  | State name | county id  | county name | Year | UV Irradiation(in W/m2) | any comments |

