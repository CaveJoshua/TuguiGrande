def test_sample_pass():
    """A simple test to make sure pytest is working."""
    assert 1 + 1 == 2

def test_barangay_data_route(client):
    """Tests the main dashboard data endpoint."""
    response = client.get('/barangay/data')
    assert response.status_code == 200
    assert 'stats' in response.json
