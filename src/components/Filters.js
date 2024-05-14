import React, { useState } from 'react';
import { Button, Checkbox, Select, Slider, Typography } from 'antd';
import * as yup from 'yup';
import { MdClose } from 'react-icons/md';
const { Option } = Select;
const { Title, Text } = Typography;

const Filters = () => {
    const [filters, setFilters] = useState({
        ageRange: [18, 85],
        incomeRange: [70000],
        heightRange: [4.5, 6],
        race: '',
        maritalStatus: false,
        obese: false,
    });

    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [showDetails, setShowDetails] = useState(false); // State to track details section visibility

    const schema = yup.object().shape({
        ageRange: yup.array().min(2, 'Please select both minimum and maximum age.').required(),
        incomeRange: yup.number().required('Please select income.'),
        heightRange: yup.array().min(2, 'Please select both minimum and maximum height.').required(),
        race: yup.string().required('Please select a race.'),
    });

    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    };

    const handleSubmit = async () => {
        try {
            await schema.validate(filters, { abortEarly: false });

            // Custom logic for calculating the probability score out of 10
            let probabilityScore = 100; // Start with maximum score

            // Age difference (decreasing age decreases score)
            probabilityScore -= (filters.ageRange[1] - 100) * -0.025; // Decrease 0.025 points for each year older than 60
            probabilityScore += (filters.ageRange[0] - 18) * 0.025; // Increase 0.025 points for each year younger than 18

            // Maximum income (increasing income decreases score)
            probabilityScore -= filters.incomeRange[0] * 0.0000025; // Decrease 0.0000025 points for each dollar of income

            // Height difference (increasing height decreases score)
            probabilityScore -= (filters.heightRange[0] - 5) * 0.1; // Decrease 0.1 points for each foot taller than 5 feet

            // Race logic
            switch (filters.race) {
                case 'white':
                    probabilityScore -= 1.5;
                    break;
                case 'black':
                    probabilityScore -= 0.8;
                    break;
                case 'asian':
                    probabilityScore -= 0.35;
                    break;
                case 'any':
                    probabilityScore -= 0.5;
                    break;
                // Add cases for other races
                default:
                    break;
            }

            // Marital status and obese logic
            if (filters.maritalStatus) probabilityScore += 0.5;
            if (filters.obese) probabilityScore += 0.5;

            // Ensure probabilityScore is between 0 and 10
            probabilityScore = Math.max(0, Math.min(100, probabilityScore));

            // Round the probability score to two decimal places
            probabilityScore = parseFloat(probabilityScore.toFixed(2));

            // setResult should divide the probability score by 10 since it's out of 10
            setResult({ ...filters, probabilityScore: probabilityScore / 100 });
            setErrors({});
            setShowDetails(true); // Show details section on successful form submission

            console.log('Result:', { ...filters, probabilityScore });
        } catch (error) {
            if (error.inner) {
                const validationErrors = {};
                error.inner.forEach(err => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
                console.error('Validation Error:', validationErrors);
            } else {
                console.error('Unhandled error:', error);
            }
        }
    };


    const handleDetailsClose = () => {
        setShowDetails(false);
    };

    return (
        <div className="container results border shadow filters mt-4" style={{ background: 'white', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <div className="mb-4 mt-4">
                <Title className='poppins-regular' level={3}>Find Your Ideal Match</Title>
            </div>
            {/* Age Range Slider */}
            <div className="mb-3">
                <label htmlFor="ageRange" className="form-label" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Age Range in Years: {filters.ageRange[0]} to {filters.ageRange[1]} ys
                </label>
                <Slider
                    range
                    min={18}
                    max={85}
                    value={filters.ageRange}
                    onChange={(value) => handleFilterChange('ageRange', value)}
                />
                <Text type="secondary">Age: {filters.ageRange[0]} to {filters.ageRange[1]} years</Text>
                {errors.ageRange && <Text type="danger">{errors.ageRange}</Text>}
            </div>
            {/* Income Range Slider */}
            <div className="mb-3">
                <label htmlFor="incomeRange" className="form-label" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Income Range per year: ${filters.incomeRange}k
                </label>
                <Slider
                    range
                    step={5000}
                    min={0}
                    max={500000}
                    value={filters.incomeRange}
                    onChange={(value) => handleFilterChange('incomeRange', value)}
                />
                <Text type="secondary">Income:  ${filters.incomeRange}</Text>
                {errors.incomeRange && <Text type="danger">{errors.incomeRange}</Text>}
            </div>
            {/* Height Range Slider */}
            <div className="mb-3">
                <label htmlFor="heightRange" className="form-label" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Height Range in Feet: {filters.heightRange[0]} to {filters.heightRange[1]}
                </label>
                <Slider
                    range
                    min={4}
                    max={7}
                    step={0.1}
                    value={filters.heightRange}
                    onChange={(value) => handleFilterChange('heightRange', value)}
                />
                <Text type="secondary">Min_Height: {filters.heightRange[0]} to {filters.heightRange[1]} Feet</Text>
                {errors.heightRange && <Text type="danger">{errors.heightRange}</Text>}
            </div>
            {/* Race Select Dropdown */}
            <div className="mb-3">
                <label htmlFor="race" className="form-label" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Race:
                </label>
                <Select
                    placeholder="Select Race"
                    style={{ width: '100%' }}
                    value={filters.race}
                    onChange={(value) => handleFilterChange('race', value)}
                >
                    <Option value="" disabled>
                        Please select one
                    </Option>
                    <Option value="white">White</Option>
                    <Option value="black">Black</Option>
                    <Option value="asian">Asian</Option>
                    <Option value="any">Any color/race</Option>
                </Select>
                {errors.race && <Text type="danger">{errors.race}</Text>}
            </div>
            {/* Include Married Checkbox */}
            <div className="mb-3">
                <Checkbox
                    checked={filters.maritalStatus}
                    onChange={(e) => handleFilterChange('maritalStatus', e.target.checked)}
                >
                    Married
                </Checkbox>
            </div>
            {/* Include Overweight Checkbox */}
            <div className="mb-3">
                <Checkbox
                    checked={filters.obese}
                    onChange={(e) => handleFilterChange('obese', e.target.checked)}
                >
                    overweight
                </Checkbox>
            </div>
            {/* Submit Button */}
            <Button type="primary" onClick={handleSubmit} style={{ width: '100%' }}>
                Find Out
            </Button>
            {/* Display Match Details */}
            {showDetails && result && (
                <div className="mt-3" style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
                    <MdClose onClick={handleDetailsClose} style={{ cursor: 'pointer', float: 'right', fontSize: '1.5rem', color: '#555' }} />
                    <Title level={3} style={{ color: '#052603', marginBottom: '15px' }}>The Man I Want 👩🏻‍🤝‍🧑🏻</Title>
                    <div style={{ marginBottom: '10px' }}>
                        <Text strong>Age Range:</Text> {result.ageRange[0]} to {result.ageRange[1]}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <Text strong>Income Range:</Text> ${result.incomeRange}k
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <Text strong>Height Range:</Text> {result.heightRange[0]} to {result.heightRange[1]} Feet
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <Text strong>Race:</Text> {result.race}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <Text strong>Marital Status:</Text> {result.maritalStatus ? 'Yes' : 'No'}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <Text strong>Over-weight:</Text> {result.obese ? 'Yes' : 'No'}
                    </div>
                    <div className='shadow poppins-medium my-4 p-4' style={{ borderRadius: '20px', color: "#3d4465", marginBottom: '10px' }}>
                        <h3>Probability Score:{result.probabilityScore}% </h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters;
