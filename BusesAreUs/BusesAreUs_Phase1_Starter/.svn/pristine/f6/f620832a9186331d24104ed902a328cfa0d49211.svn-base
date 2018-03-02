package ca.ubc.cs.cpsc210.translink.tests.model;

import ca.ubc.cs.cpsc210.translink.model.Route;
import ca.ubc.cs.cpsc210.translink.model.Stop;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;


public class RouteTest {
    private Route r;
    private Stop s1;
    private Stop s2;
    private Stop s3;

    @Before
    public void setup() {
        r = new Route("AB10");
        s1 = new Stop(10, "UBC", null);
        s2 = new Stop(20, "SFU", null);
        s3 = new Stop(10, "NoWhere", null);

        r.addStop(s1);
        r.addStop(s2);
    }

    @Test
    public void testHasStop() {
        assertTrue(r.hasStop(s1));
        assertTrue(r.hasStop(s3));
    }
}
