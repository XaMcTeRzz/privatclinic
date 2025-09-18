// Test script to verify data synchronization between admin panel and website
async function testAdminDataSync() {
    console.log('Testing admin data synchronization...');
    
    // Test doctors data
    try {
        console.log('Testing doctors data...');
        const doctorsResponse = await fetch('/api/load-data?filename=doctors.json');
        const doctorsData = await doctorsResponse.json();
        console.log('Loaded doctors data:', doctorsData.length, 'doctors');
        
        // Add a test doctor
        const newDoctor = {
            id: Date.now(),
            name: "Тестовый Врач",
            specialty: "Тестовая специальность",
            experience: 5,
            photo: "images/doctor-placeholder.jpg",
            education: "Тестовое образование",
            description: "Тестовое описание врача",
            rating: 5,
            reviews_count: 0,
            available: true,
            qualifications: [],
            schedule: {
                monday: "9:00-17:00",
                tuesday: "9:00-17:00",
                wednesday: "9:00-17:00",
                thursday: "9:00-17:00",
                friday: "9:00-15:00",
                saturday: "выходной",
                sunday: "выходной"
            }
        };
        
        const updatedDoctors = [...doctorsData, newDoctor];
        
        // Save the data
        const saveResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: 'doctors.json',
                data: updatedDoctors
            })
        });
        
        if (saveResponse.ok) {
            console.log('Successfully saved doctors data');
            
            // Verify the data was saved
            const verifyResponse = await fetch('/api/load-data?filename=doctors.json');
            const verifyData = await verifyResponse.json();
            const addedDoctor = verifyData.find(d => d.id === newDoctor.id);
            
            if (addedDoctor) {
                console.log('Doctor data synchronization test PASSED');
            } else {
                console.log('Doctor data synchronization test FAILED - doctor not found after save');
            }
        } else {
            console.log('Failed to save doctors data');
        }
    } catch (error) {
        console.error('Error testing doctors data:', error);
    }
    
    // Test services data
    try {
        console.log('Testing services data...');
        const servicesResponse = await fetch('/api/load-data?filename=services.json');
        const servicesData = await servicesResponse.json();
        console.log('Loaded services data:', servicesData.length, 'services');
    } catch (error) {
        console.error('Error testing services data:', error);
    }
    
    // Test prices data
    try {
        console.log('Testing prices data...');
        const pricesResponse = await fetch('/api/load-data?filename=prices.json');
        const pricesData = await pricesResponse.json();
        console.log('Loaded prices data:', pricesData.length, 'categories');
    } catch (error) {
        console.error('Error testing prices data:', error);
    }
}

// Run the test
testAdminDataSync();